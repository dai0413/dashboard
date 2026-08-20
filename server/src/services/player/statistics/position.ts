import { Types } from "mongoose";
import { PlayerAppearanceModel } from "../../../models/player-appearance.js";
import { TransferModel } from "../../../models/transfer.js";
import { position } from "@dai0413/myorg-shared";
import { MatchGroupInfo } from "../types.js";
import { createStatisticsKey } from "../utils/createStatisticsKey.js";
import { PlayerStatisticsGroupBy } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

type AppearancePositionAggregate = {
  _id: Types.ObjectId;
  groupId?: Types.ObjectId;
  positions: string[];
};

type AppearanceMatchPositionAggregate = {
  _id: {
    player: Types.ObjectId;
    match: Types.ObjectId;
    team: Types.ObjectId;
  };
  positions: string[];
};

type TransferPositionAggregate = {
  _id: Types.ObjectId;
  position: string[];
};

type PlayerPosition = {
  groupId?: Types.ObjectId;
  mainPosition?: string;
  positionCounts: Partial<Record<string, number>>;
};

type ResolvePlayerPositionsParams = {
  playerIds: Types.ObjectId[];
  matchIds: Types.ObjectId[];
  teamId?: Types.ObjectId;
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
};

type PositionResolveTarget = {
  playerId: Types.ObjectId;
  groupId?: Types.ObjectId;
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

const getPositionGroupId = ({
  matchId,
  teamId,
  groupBy,
  matchGroupMap,
}: {
  matchId: Types.ObjectId;
  teamId?: Types.ObjectId;
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
}): Types.ObjectId | undefined => {
  if (!groupBy) {
    return undefined;
  }

  if (groupBy === PlayerStatisticsGroupBy.TEAM) {
    return teamId;
  }

  const matchGroup = matchGroupMap.get(matchId.toString());

  if (!matchGroup) {
    return undefined;
  }

  if (groupBy === PlayerStatisticsGroupBy.SEASON) {
    return matchGroup.season;
  }

  if (groupBy === PlayerStatisticsGroupBy.COMPETITION) {
    return matchGroup.competition;
  }

  return undefined;
};

const getAppearancePositions = async ({
  targets,
  matchIds,
  teamId,
  groupBy,
  matchGroupMap,
}: {
  targets: PositionResolveTarget[];
  matchIds?: Types.ObjectId[];
  teamId?: Types.ObjectId;
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
}): Promise<AppearancePositionAggregate[]> => {
  const playerIds = [
    ...new Map(
      targets.map((target) => [target.playerId.toString(), target.playerId]),
    ).values(),
  ];

  const aggregates =
    await PlayerAppearanceModel.aggregate<AppearanceMatchPositionAggregate>([
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
          _id: {
            player: "$player",
            match: "$match",
            team: "$team",
          },
          positions: {
            $push: "$position",
          },
        },
      },
    ]);

  const resultMap = new Map<string, AppearancePositionAggregate>();

  for (const item of aggregates) {
    const { player, match, team } = item._id;

    const groupId = getPositionGroupId({
      matchId: match,
      teamId: team,
      groupBy,
      matchGroupMap,
    });

    const key = createStatisticsKey(player, groupId);

    const current = resultMap.get(key);

    if (current) {
      current.positions.push(...item.positions);
    } else {
      resultMap.set(key, {
        _id: player,
        groupId,
        positions: [...item.positions],
      });
    }
  }

  return [...resultMap.values()];
};

const getRemainingTargets = (
  targets: PositionResolveTarget[],
  positionMap: PositionMap,
): PositionResolveTarget[] => {
  return targets.filter(
    ({ playerId, groupId }) =>
      !positionMap.has(createStatisticsKey(playerId, groupId)),
  );
};

const createPositionResolveTargets = ({
  playerIds,
  matchIds,
  teamId,
  groupBy,
  matchGroupMap,
}: {
  playerIds: Types.ObjectId[];
  matchIds: Types.ObjectId[];
  teamId?: Types.ObjectId;
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
}): PositionResolveTarget[] => {
  if (!groupBy) {
    return playerIds.map((playerId) => ({
      playerId,
    }));
  }

  if (groupBy === PlayerStatisticsGroupBy.TEAM) {
    if (!teamId) {
      return playerIds.map((playerId) => ({
        playerId,
      }));
    }

    return playerIds.map((playerId) => ({
      playerId,
      groupId: teamId,
    }));
  }

  const groupMap = new Map<string, Types.ObjectId>();

  for (const matchId of matchIds) {
    const matchGroup = matchGroupMap.get(matchId.toString());

    if (!matchGroup) {
      continue;
    }

    const groupId =
      groupBy === PlayerStatisticsGroupBy.SEASON
        ? matchGroup.season
        : matchGroup.competition;

    if (groupId) {
      groupMap.set(groupId.toString(), groupId);
    }
  }

  return playerIds.flatMap((playerId) =>
    [...groupMap.values()].map((groupId) => ({
      playerId,
      groupId,
    })),
  );
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

    positionMap.set(createStatisticsKey(appearance._id, appearance.groupId), {
      groupId: appearance.groupId,
      mainPosition,
      positionCounts,
    });
  }
};

const resolveAppearanceStage = async (
  positionMap: PositionMap,
  targets: PositionResolveTarget[],
  params: {
    matchIds?: Types.ObjectId[];
    teamId?: Types.ObjectId;
    groupBy?: PlayerStatisticsGroupBy;
    matchGroupMap: Map<string, MatchGroupInfo>;
  },
) => {
  if (targets.length === 0) {
    return;
  }

  const appearanceStats = await getAppearancePositions({
    targets,
    ...params,
  });

  applyAppearancePositions(positionMap, appearanceStats);
};

const resolveTransferStage = async (
  positionMap: PositionMap,
  targets: PositionResolveTarget[],
) => {
  if (targets.length === 0) {
    return;
  }

  const playerIds = [
    ...new Map(
      targets.map((target) => [target.playerId.toString(), target.playerId]),
    ).values(),
  ];

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

  const transferMap = new Map(
    transferStats.map((transfer) => [
      transfer._id.toString(),
      transfer.position?.[0],
    ]),
  );

  for (const target of targets) {
    const position = transferMap.get(target.playerId.toString());

    if (!position || !isValidPosition(position)) {
      continue;
    }

    positionMap.set(createStatisticsKey(target.playerId, target.groupId), {
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
  groupBy,
  matchGroupMap,
}: ResolvePlayerPositionsParams): Promise<PositionMap> => {
  const positionMap: PositionMap = new Map();

  if (playerIds.length === 0) {
    return positionMap;
  }

  const targets = createPositionResolveTargets({
    playerIds,
    matchIds,
    teamId,
    groupBy,
    matchGroupMap,
  });

  // ① 指定された match + team
  let remainingTargets = getRemainingTargets(targets, positionMap);
  if (matchIds.length > 0) {
    await resolveAppearanceStage(positionMap, remainingTargets, {
      matchIds,
      teamId,
      groupBy,
      matchGroupMap,
    });
  }

  // ② team の全 Appearance
  remainingTargets = getRemainingTargets(targets, positionMap);

  if (remainingTargets.length > 0 && teamId) {
    await resolveAppearanceStage(positionMap, remainingTargets, {
      teamId,
      groupBy,
      matchGroupMap,
    });
  }

  // ③ 全 Appearance
  remainingTargets = getRemainingTargets(targets, positionMap);

  if (remainingTargets.length > 0) {
    await resolveAppearanceStage(positionMap, remainingTargets, {
      groupBy,
      matchGroupMap,
    });
  }

  // ④ 最新 Transfer
  remainingTargets = getRemainingTargets(targets, positionMap);

  if (remainingTargets.length > 0) {
    await resolveTransferStage(positionMap, remainingTargets);
  }

  return positionMap;
};
