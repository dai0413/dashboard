import { Request } from "express";
import { Types } from "mongoose";
import { CreateItemsResponse, ReadItemsResponse } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import BadRequestError from "../../errors/bad-request.js";
import { PlayerModel } from "../../models/player.js";
import { MatchEventTypeModel } from "../../models/match-event-type.js";
import InternalServerError from "../../errors/internal-server.js";
import { MatchModel } from "../../models/match.js";
import { buildMatchStage } from "../../controllers/helpers/crud/query/buildMatchStage.js";
import { resolvePlayerPositions } from "./statistics/position.js";
import { getPlayerAppearanceStatistics } from "./statistics/appearance.js";
import { getPlayerMatchEventLogStatistics } from "./statistics/eventLog.js";
import {
  getAppearancePlayerIds,
  getRegisteredPlayerIds,
} from "./resolve/playerIds.js";

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

export const getPlayerStatistics = async (
  req: Request,
): Promise<CreateItemsResponse<PlayerStatistic[]>> => {
  const { player, team, season } = req.body;

  let playerObjectIds: Types.ObjectId[];

  if (player) {
    const playerIds = (Array.isArray(player) ? player : [player]).filter(
      (id): id is string => typeof id === "string",
    );

    const invalidIds = playerIds.filter((id) => !Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      throw new BadRequestError(`不正なplayerIdです: ${invalidIds.join(",")}`);
    }

    playerObjectIds = playerIds.map((id) => new Types.ObjectId(id));
  } else {
    if (!season || !Types.ObjectId.isValid(season)) {
      throw new BadRequestError("seasonを指定してください");
    }

    const playerIdSet = new Set<Types.ObjectId>();

    // ① Registration
    const registrationPlayerIds = await getRegisteredPlayerIds(season);

    registrationPlayerIds.forEach((id) => {
      playerIdSet.add(id);
    });

    // ② Appearance
    const appearancePlayerIds = await getAppearancePlayerIds(season);

    appearancePlayerIds.forEach((id) => {
      playerIdSet.add(id);
    });

    playerObjectIds = [...playerIdSet];
  }

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

  let teamObjectId: undefined | Types.ObjectId;

  if (team) {
    teamObjectId = new Types.ObjectId(team as string);
  }

  const filterCondition = buildMatchStage(req.body, matchQueryConfig);

  const matches = await MatchModel.find(filterCondition).select("_id").lean();
  const matchIds = matches.map((match) => match._id);

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
    }),
    getPlayerMatchEventLogStatistics({
      playerObjectIds,
      matchIds,
      teamObjectId,
      goalId,
      assistId,
    }),
  ]);

  const appearanceMap = new Map(
    appearanceStats.map((a) => [a._id.toString(), a]),
  );

  const matchEventLogMap = new Map(
    matchEventLogStats.map((a) => [a._id.toString(), a]),
  );

  const positionMap = await resolvePlayerPositions({
    playerIds: playerObjectIds,
    matchIds,
    teamId: teamObjectId,
  });

  const result: PlayerStatistic[] = playerObjectIds
    .map((id) => playerMap.get(id.toString()))
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

      const position = positionMap.get(playerObj._id.toString());

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
        mainPosition: position?.mainPosition,
        positionCounts: position?.positionCounts ?? {},
      };
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
