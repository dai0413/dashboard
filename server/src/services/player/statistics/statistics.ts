import { Request } from "express";
import { CreateItemsResponse } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import BadRequestError from "../../../errors/bad-request.js";
import { PlayerModel } from "../../../models/player.js";
import { MatchEventTypeModel } from "../../../models/match-event-type.js";
import InternalServerError from "../../../errors/internal-server.js";
import { buildMatchStage } from "../../../controllers/helpers/crud/query/buildMatchStage.js";
import {
  resolvePlayerPositions,
  getPlayerAppearanceStatistics,
  getPlayerMatchEventLogStatistics,
  getPlayerTeams,
} from "./index.js";
import { createStatisticsKey } from "./utils/createStatisticsKey.js";
import {
  resolve,
  resolveStatisticsGroup,
  resolveStatisticsGroupIds,
} from "./resolve/index.js";

const matchQueryConfig = [
  {
    field: "date",
    type: "Date",
  },
  {
    field: "_id",
    type: "ObjectId",
  },
  {
    field: "competition",
    type: "ObjectId",
  },
  {
    field: "season",
    type: "ObjectId",
  },
];

// playerなし season必須
// → seasonから対象playerを決定
// → seasonの全matchを対象

// playerあり
// → Registration + Appearanceから対象match候補を決定
// → season / competition / date等のMatch filterを適用
export const getPlayerStatistics = async (
  req: Request,
): Promise<CreateItemsResponse<PlayerStatistic[]>> => {
  const { player, team, season, groupBy } = req.body;

  if (groupBy && !player) {
    throw new BadRequestError(
      "groupByを指定する場合はplayerを指定してください",
    );
  }

  const filterCondition = buildMatchStage(req.body, matchQueryConfig);

  const {
    teamObjectId,
    playerObjectIds,
    seasonObjectIds,
    matchGroupMap,
    matchIds,
  } = await resolve({ player, team, season, filterCondition });

  if (playerObjectIds.length === 0) {
    return {
      data: [],
      totalCount: 0,
      success: true,
      message: "取得しました",
      successCount: 0,
      failedCount: 0,
      failedItems: [],
    };
  }

  const [players, eventTypes] = await Promise.all([
    PlayerModel.find({ _id: { $in: playerObjectIds } }).lean(),
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

  const [appearanceStats, matchEventLogStats] = await Promise.all([
    getPlayerAppearanceStatistics({
      playerObjectIds,
      matchIds,
      teamObjectId,
      groupBy,
      matchGroupMap,
    }),
    getPlayerMatchEventLogStatistics({
      playerObjectIds,
      matchIds,
      teamObjectId,
      goalId,
      assistId,
      groupBy,
      matchGroupMap,
    }),
  ]);

  const appearanceMap = new Map(
    appearanceStats.map((a) => [createStatisticsKey(a._id, a.groupId), a]),
  );

  const matchEventLogMap = new Map(
    matchEventLogStats.map((a) => [createStatisticsKey(a._id, a.groupId), a]),
  );

  const positionMap = await resolvePlayerPositions({
    playerIds: playerObjectIds,
    matchIds,
    teamId: teamObjectId,
    matchGroupMap,
    groupBy,
  });

  const groupIds = resolveStatisticsGroupIds({
    groupBy,
    matchIds,
    seasonIds: seasonObjectIds,
    teamObjectId,
    matchGroupMap,
  });

  const groupMap = await resolveStatisticsGroup({
    groupBy,
    groupIds,
  });

  const playerTeamsMap = await getPlayerTeams({
    seasonIds: seasonObjectIds,
    playerIds: playerObjectIds,
    matchIds,
    teamObjectId,
    groupBy,
    matchGroupMap,
  });

  // 返り値作成
  const result: PlayerStatistic[] = playerObjectIds.flatMap((playerId) => {
    const playerObj = playerMap.get(playerId.toString());

    if (!playerObj) {
      return [];
    }

    const values = groupIds.map((groupId) => {
      const statisticsKey = createStatisticsKey(playerId, groupId);

      const appearance = appearanceMap.get(statisticsKey);
      const matchEventLog = matchEventLogMap.get(statisticsKey);
      const position = positionMap.get(statisticsKey);
      const teams = playerTeamsMap.get(statisticsKey) ?? [];

      const playerData = {
        ...playerObj,
        _id: playerObj._id.toString(),
      };

      const starts = appearance?.starts || 0;
      const subs = appearance?.subs || 0;

      const group =
        groupId && groupBy
          ? {
              by: groupBy,
              id: groupId.toString(),
              data: groupMap.get(groupId.toString()),
            }
          : undefined;

      const value: PlayerStatistic = {
        player: playerData,
        teams,
        group,
        appearances: starts + subs,
        starts,
        subs,
        bench: appearance?.bench ?? 0,
        minutes: appearance?.minutes ?? 0,
        goals: matchEventLog?.goals ?? 0,
        assists: matchEventLog?.assists ?? 0,
        mainPosition: position?.mainPosition,
        positionCounts: position?.positionCounts ?? {},
      };

      return value;
    });

    return values;
  });

  return {
    data: result,
    totalCount: result.length,
    success: true,
    message: "取得しました",
    successCount: result.length,
    failedCount: 0,
    failedItems: [],
  };
};
