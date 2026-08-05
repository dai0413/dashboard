import { Request } from "express";
import { Types } from "mongoose";
import { position, ReadItemsResponse } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import BadRequestError from "../../errors/bad-request.js";
import { PlayerModel } from "../../models/player.js";
import { PlayerAppearanceModel } from "../../models/player-appearance.js";
import { PlayerMatchEventLogModel } from "../../models/player-match-event-log.js";
import { MatchEventTypeModel } from "../../models/match-event-type.js";
import InternalServerError from "../../errors/internal-server.js";

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
  return positionOptions
    .filter((position) => positionCounts[position] !== undefined)
    .sort((a, b) => (positionCounts[b] ?? 0) - (positionCounts[a] ?? 0))[0];
};

type AppearanceAggregate = {
  _id: Types.ObjectId;
  starts: number;
  subs: number;
  bench: number;
  minutes: number;
  positions: Position[];
};

type MatchEventLogAggregate = {
  _id: Types.ObjectId;
  goals: number;
  assists: number;
};

export const getPlayerStatistics = async (
  req: Request,
): Promise<ReadItemsResponse<PlayerStatistic[]>> => {
  const { player } = req.query;

  if (!player) {
    throw new BadRequestError("playerIdを指定してください");
  }

  const playerIds = (Array.isArray(player) ? player : [player]).filter(
    (id): id is string => typeof id === "string",
  );

  if (playerIds.length === 0) {
    throw new BadRequestError("playerIdを指定してください");
  }

  const invalidIds = playerIds.filter((id) => !Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new BadRequestError(`不正なplayerIdです: ${invalidIds.join(",")}`);
  }

  const [players, eventTypes] = await Promise.all([
    PlayerModel.find({ _id: { $in: playerIds } }).lean(),
    MatchEventTypeModel.find({
      name: { $in: ["得点", "アシスト"] },
    }).lean(),
  ]);

  // _id(string) -> player のMapを作成
  const playerMap = new Map(players.map((p) => [p._id.toString(), p]));

  const goalId = eventTypes.find((e) => e.name === "得点")?._id;
  const assistId = eventTypes.find((e) => e.name === "アシスト")?._id;

  if (!goalId || !assistId) {
    throw new InternalServerError(
      "MatchEventTypeマスタに「得点」または「アシスト」が登録されていません",
    );
  }

  const objectIds = playerIds.map((id) => new Types.ObjectId(id));

  const [appearanceStats, matchEventLogStats] = await Promise.all([
    PlayerAppearanceModel.aggregate<AppearanceAggregate>([
      {
        $match: {
          player: { $in: objectIds },
        },
      },
      {
        $group: {
          _id: "$player",
          starts: {
            $sum: { $cond: [{ $eq: ["$play_status", "start"] }, 1, 0] },
          },
          subs: {
            $sum: { $cond: [{ $eq: ["$play_status", "sub"] }, 1, 0] },
          },
          bench: {
            $sum: { $cond: [{ $eq: ["$play_status", "bench"] }, 1, 0] },
          },
          minutes: {
            $sum: "$time",
          },
          positions: {
            $push: "$position",
          },
        },
      },
    ]),
    PlayerMatchEventLogModel.aggregate<MatchEventLogAggregate>([
      {
        $match: {
          player: { $in: objectIds },
        },
      },
      {
        $group: {
          _id: "$player",
          goals: {
            $sum: { $cond: [{ $eq: ["$match_event_type", goalId] }, 1, 0] },
          },
          assists: {
            $sum: {
              $cond: [{ $eq: ["$match_event_type", assistId] }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  const appearanceMap = new Map(
    appearanceStats.map((a) => [a._id.toString(), a]),
  );

  const matchEventLogMap = new Map(
    matchEventLogStats.map((a) => [a._id.toString(), a]),
  );

  const result: PlayerStatistic[] = playerIds
    .map((id) => playerMap.get(id))
    .filter(
      (playerObj): playerObj is (typeof players)[number] =>
        playerObj !== undefined,
    ) // 存在しないIDは除外
    .map((playerObj) => {
      const appearance = appearanceMap.get(playerObj._id.toString());
      const matchEventLog = matchEventLogMap.get(playerObj._id.toString());

      const playerData = {
        ...playerObj,
        _id: playerObj._id.toString(),
      };

      const positionCounts = createPositionCounts(appearance?.positions ?? []);
      const mainPosition = getMainPosition(positionCounts);

      const starts = appearance?.starts ?? 0;
      const subs = appearance?.subs ?? 0;

      return {
        player: playerData,
        appearances: starts + subs,
        starts,
        subs,
        bench: appearance?.bench ?? 0,
        minutes: appearance?.minutes ?? 0,
        goals: matchEventLog?.goals ?? 0,
        assists: matchEventLog?.assists ?? 0,
        mainPosition,
        positionCounts,
      };
    });

  return { data: result, totalCount: result.length, page: 1, pageSize: 1 };
};
