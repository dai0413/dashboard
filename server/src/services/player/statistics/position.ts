import { Types } from "mongoose";
import { PlayerAppearanceModel } from "../../../models/player-appearance.js";
import { TransferModel } from "../../../models/transfer.js";
import { position } from "@dai0413/myorg-shared";

type AppearancePositionAggregate = {
  _id: Types.ObjectId;
  positions: string[];
};

type TransferPositionAggregate = {
  _id: Types.ObjectId;
  position: string[];
};

type PlayerPosition = {
  mainPosition?: string;
  positionCounts: Partial<Record<string, number>>;
};

type ResolvePlayerPositionsParams = {
  playerIds: Types.ObjectId[];
  matchIds: Types.ObjectId[];
  teamId?: Types.ObjectId;
};

const positionOptions = position().map((item) => item.key);
type Position = (typeof positionOptions)[number];

const isValidPosition = (position: string): position is Position => {
  return (positionOptions as string[]).includes(position);
};

const createPositionCounts = (
  positions: string[],
): Partial<Record<Position, number>> => {
  return positions.reduce(
    (acc, position) => {
      if (!position) return acc;

      if (!isValidPosition(position)) {
        console.warn(`Unknown position value: ${position}`);
        return acc;
      }

      acc[position] = (acc[position] ?? 0) + 1;

      return acc;
    },
    {} as Partial<Record<Position, number>>,
  );
};

const getMainPosition = (
  positionCounts: Partial<Record<Position, number>>,
): Position | undefined => {
  let mainPosition: Position | undefined;
  let maxCount = 0;

  for (const position of positionOptions) {
    const count = positionCounts[position] ?? 0;

    if (count > maxCount) {
      maxCount = count;
      mainPosition = position;
    }
  }

  return mainPosition;
};

const getAppearancePositions = async ({
  playerIds,
  matchIds,
  teamId,
}: {
  playerIds: Types.ObjectId[];
  matchIds?: Types.ObjectId[];
  teamId?: Types.ObjectId;
}): Promise<AppearancePositionAggregate[]> => {
  return PlayerAppearanceModel.aggregate<AppearancePositionAggregate>([
    {
      $match: {
        player: {
          $in: playerIds,
        },
        ...(teamId && {
          team: teamId,
        }),
        ...(matchIds &&
          matchIds.length > 0 && {
            match: {
              $in: matchIds,
            },
          }),
      },
    },
    {
      $group: {
        _id: "$player",
        positions: {
          $push: "$position",
        },
      },
    },
  ]);
};

const getRemainingPlayerIds = (
  playerIds: Types.ObjectId[],
  positionMap: Map<string, PlayerPosition>,
): Types.ObjectId[] => {
  return playerIds.filter((playerId) => !positionMap.has(playerId.toString()));
};

type PositionMap = Map<string, PlayerPosition>;

const applyAppearancePositions = (
  positionMap: PositionMap,
  appearanceStats: AppearancePositionAggregate[],
) => {
  for (const appearance of appearanceStats) {
    const positionCounts = createPositionCounts(appearance.positions);
    const mainPosition = getMainPosition(positionCounts);

    if (!mainPosition) {
      continue;
    }

    positionMap.set(appearance._id.toString(), {
      mainPosition,
      positionCounts,
    });
  }
};

const resolveAppearanceStage = async (
  positionMap: PositionMap,
  playerIds: Types.ObjectId[],
  params: {
    matchIds?: Types.ObjectId[];
    teamId?: Types.ObjectId;
  },
) => {
  if (playerIds.length === 0) {
    return;
  }

  const appearanceStats = await getAppearancePositions({
    playerIds,
    ...params,
  });

  applyAppearancePositions(positionMap, appearanceStats);
};

const resolveTransferStage = async (
  positionMap: PositionMap,
  playerIds: Types.ObjectId[],
) => {
  const transferStats =
    await TransferModel.aggregate<TransferPositionAggregate>([
      {
        $match: {
          player: {
            $in: playerIds,
          },
          position: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      {
        $group: {
          _id: "$player",
          position: {
            $first: "$position",
          },
        },
      },
    ]);

  for (const transfer of transferStats) {
    const position = transfer.position?.[0];

    if (!position || !isValidPosition(position)) {
      continue;
    }

    positionMap.set(transfer._id.toString(), {
      mainPosition: position,
      positionCounts: {},
    });
  }
};

/**
 * Playerのposition情報を解決する。
 *
 * 優先順位:
 * 1. 指定されたmatch + teamのAppearance
 * 2. teamの全Appearance
 * 3. 全Appearance
 * 4. 最新のTransfer
 *
 * Transfer由来のpositionは実績値ではないため、
 * positionCountsには含めずmainPositionのみ設定する。
 */
export const resolvePlayerPositions = async ({
  playerIds,
  matchIds,
  teamId,
}: ResolvePlayerPositionsParams): Promise<Map<string, PlayerPosition>> => {
  const positionMap: PositionMap = new Map();

  if (playerIds.length === 0) {
    return positionMap;
  }

  // ① 指定された match + team
  let remainingPlayerIds = getRemainingPlayerIds(playerIds, positionMap);

  if (matchIds.length > 0) {
    await resolveAppearanceStage(positionMap, remainingPlayerIds, {
      matchIds,
      teamId,
    });
  }

  // ② team の全 Appearance
  remainingPlayerIds = getRemainingPlayerIds(playerIds, positionMap);

  if (remainingPlayerIds.length > 0 && teamId) {
    await resolveAppearanceStage(positionMap, remainingPlayerIds, {
      teamId,
    });
  }

  // ③ 全 Appearance
  remainingPlayerIds = getRemainingPlayerIds(playerIds, positionMap);

  if (remainingPlayerIds.length > 0) {
    await resolveAppearanceStage(positionMap, remainingPlayerIds, {});
  }

  // ④ 最新 Transfer
  remainingPlayerIds = getRemainingPlayerIds(playerIds, positionMap);

  if (remainingPlayerIds.length > 0) {
    await resolveTransferStage(positionMap, remainingPlayerIds);
  }

  return positionMap;
};
