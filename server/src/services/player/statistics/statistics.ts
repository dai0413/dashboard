import { Request } from "express";
import { Types } from "mongoose";
import { CreateItemsResponse } from "@dai0413/myorg-shared";
import {
  PlayerStatistic,
  PlayerStatisticsGroupBy,
} from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { competition, team, season } from "@dai0413/myorg-shared/models-config";
import BadRequestError from "../../../errors/bad-request.js";
import { PlayerModel } from "../../../models/player.js";
import { MatchEventTypeModel } from "../../../models/match-event-type.js";
import { MatchModel } from "../../../models/match.js";
import { TeamModel } from "../../../models/team.js";
import { CompetitionModel } from "../../../models/competition.js";
import { SeasonModel } from "../../../models/season.js";
import { getNest } from "../../../controllers/helpers/getNest.js";
import { PlayerRegistrationModel } from "../../../models/player-registration.js";
import { PlayerAppearanceModel } from "../../../models/player-appearance.js";
import InternalServerError from "../../../errors/internal-server.js";
import { buildMatchStage } from "../../../controllers/helpers/crud/query/buildMatchStage.js";
import {
  resolvePlayerPositions,
  getPlayerAppearanceStatistics,
  getPlayerMatchEventLogStatistics,
  getPlayerTeams,
} from "./index.js";
import { createStatisticsKey } from "./utils/createStatisticsKey.js";
import { MatchGroupInfo } from "./types.js";
import { resolvePlayerTargets } from "./resolve/index.js";

const modelsConfig = {
  competition,
  team,
  season,
};

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

const getStatisticsGroupIds = ({
  groupBy,
  matchIds,
  seasonIds,
  teamObjectId,
  matchGroupMap,
}: {
  groupBy?: PlayerStatisticsGroupBy;
  matchIds: Types.ObjectId[];
  seasonIds?: Types.ObjectId[];
  teamObjectId?: Types.ObjectId;
  matchGroupMap: Map<string, MatchGroupInfo>;
}): (Types.ObjectId | undefined)[] => {
  if (!groupBy) {
    return [undefined];
  }

  if (groupBy === PlayerStatisticsGroupBy.TEAM) {
    return teamObjectId ? [teamObjectId] : [undefined];
  }

  if (groupBy === PlayerStatisticsGroupBy.SEASON) {
    const ids = new Map<string, Types.ObjectId>();

    // Registration側のSeason
    if (seasonIds) {
      seasonIds.forEach((seasonId) => {
        ids.set(seasonId.toString(), seasonId);
      });
    }

    // Appearance側のSeason
    for (const matchId of matchIds) {
      const season = matchGroupMap.get(matchId.toString())?.season;

      if (season) {
        ids.set(season.toString(), season);
      }
    }

    return [...ids.values()];
  }

  // COMPETITION
  const ids = new Map<string, Types.ObjectId>();

  for (const matchId of matchIds) {
    const competition = matchGroupMap.get(matchId.toString())?.competition;

    if (competition) {
      ids.set(competition.toString(), competition);
    }
  }

  return [...ids.values()];
};

const getPlayerMatchIds = async ({
  playerIds,
  season,
  teamId,
}: {
  playerIds: Types.ObjectId[];
  season?: string;
  teamId?: Types.ObjectId;
}): Promise<Types.ObjectId[]> => {
  const registrationMatchIds = (await PlayerRegistrationModel.distinct(
    "match",
    {
      player: { $in: playerIds },
      ...(season && {
        season: new Types.ObjectId(season),
      }),
      ...(teamId && {
        team: teamId,
      }),
    },
  )) as Types.ObjectId[];

  const appearanceMatchIds = (await PlayerAppearanceModel.distinct("match", {
    player: { $in: playerIds },
    ...(teamId && {
      team: teamId,
    }),
  })) as Types.ObjectId[];

  const matchIdMap = new Map<string, Types.ObjectId>();

  for (const id of registrationMatchIds) {
    matchIdMap.set(id.toString(), id);
  }

  for (const id of appearanceMatchIds) {
    matchIdMap.set(id.toString(), id);
  }

  return [...matchIdMap.values()];
};

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

  let { playerObjectIds, seasonObjectIds } = await resolvePlayerTargets({
    player,
    season,
  });

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

  const playerMatchIds = await getPlayerMatchIds({
    playerIds: playerObjectIds,
    teamId: teamObjectId,
  });

  const filterCondition = buildMatchStage(req.body, matchQueryConfig);

  const matches = await MatchModel.find({
    ...filterCondition,
    _id: { $in: playerMatchIds },
  })
    .select("_id season competition")
    .lean();

  const matchIds = matches.map((match) => match._id);

  const matchGroupMap = new Map(
    matches.map((match) => [
      match._id.toString(),
      {
        season: match.season,
        competition: match.competition,
      },
    ]),
  );

  const matchSeasonIds = [
    ...new Map(
      matches
        .map((match) => match.season)
        .filter((season): season is Types.ObjectId => !!season)
        .map((season) => [season.toString(), season]),
    ).values(),
  ];

  seasonObjectIds = [
    ...new Map(
      [...seasonObjectIds, ...matchSeasonIds].map((id) => [id.toString(), id]),
    ).values(),
  ];

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

  // groupIdから groupByのモデルデータmap
  const groupIds = getStatisticsGroupIds({
    groupBy,
    matchIds,
    seasonIds: seasonObjectIds,
    teamObjectId,
    matchGroupMap,
  });

  const getStatisticsGroupMap = async ({
    groupBy,
    groupIds,
  }: {
    groupBy?: PlayerStatisticsGroupBy;
    groupIds: (Types.ObjectId | undefined)[];
  }) => {
    if (!groupBy || groupIds.length === 0) {
      return new Map();
    }

    if (groupBy === PlayerStatisticsGroupBy.TEAM) {
      const POPULATE_PATHS = modelsConfig["team"]().POPULATE_PATHS;

      const teams = await TeamModel.aggregate([
        {
          $match: {
            _id: { $in: groupIds },
          },
        },
        ...getNest(false, POPULATE_PATHS),
      ]);

      return new Map(teams.map((team) => [team._id.toString(), team]));
    }

    if (groupBy === PlayerStatisticsGroupBy.COMPETITION) {
      const POPULATE_PATHS = modelsConfig["competition"]().POPULATE_PATHS;

      const competitions = await CompetitionModel.aggregate([
        {
          $match: {
            _id: { $in: groupIds },
          },
        },
        ...getNest(false, POPULATE_PATHS),
      ]);

      return new Map(
        competitions.map((competition) => [
          competition._id.toString(),
          competition,
        ]),
      );
    }

    const POPULATE_PATHS = modelsConfig["season"]().POPULATE_PATHS;

    const seasons = await SeasonModel.aggregate([
      {
        $match: {
          _id: { $in: groupIds },
        },
      },
      ...getNest(false, POPULATE_PATHS),
    ]);

    return new Map(seasons.map((season) => [season._id.toString(), season]));
  };

  const groupMap = await getStatisticsGroupMap({
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
