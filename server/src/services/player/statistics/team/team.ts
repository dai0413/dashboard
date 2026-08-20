import { Types } from "mongoose";
import { team as modelsConfig } from "@dai0413/myorg-shared/models-config";
import { MatchGroupInfo } from "../types.js";
import { PlayerRegistrationModel } from "../../../../models/player-registration.js";
import { PlayerAppearanceModel } from "../../../../models/player-appearance.js";
import { createStatisticsKey } from "../utils/createStatisticsKey.js";
import { TeamModel } from "../../../../models/team.js";
import { getNest } from "../../../../controllers/helpers/getNest.js";
import {
  PlayerStatistic,
  PlayerStatisticsGroupBy,
} from "@dai0413/myorg-shared/types/aggregate/player/statistic";

const TEAM_POPULATE_PATHS = modelsConfig().POPULATE_PATHS;

type Team = PlayerStatistic["teams"][number];

type Params = {
  seasonIds?: Types.ObjectId[];
  playerIds: Types.ObjectId[];
  matchIds: Types.ObjectId[];
  teamObjectId?: Types.ObjectId;
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
};

type RegistrationTeamAggregate = {
  _id: {
    player: Types.ObjectId;
    team: Types.ObjectId;
    season: Types.ObjectId;
  };
};

type AppearanceTeamAggregate = {
  _id: {
    player: Types.ObjectId;
    team: Types.ObjectId;
    match: Types.ObjectId;
  };
};

export const getPlayerTeams = async ({
  seasonIds,
  playerIds,
  matchIds,
  teamObjectId,
  groupBy,
  matchGroupMap,
}: Params): Promise<Map<string, Team[]>> => {
  if (playerIds.length === 0) {
    return new Map();
  }

  const [registrationStats, appearanceStats] = await Promise.all([
    PlayerRegistrationModel.aggregate<RegistrationTeamAggregate>([
      {
        $match: {
          player: { $in: playerIds },
          ...(teamObjectId && {
            team: teamObjectId,
          }),
          ...(seasonIds && { season: { $in: seasonIds } }),
        },
      },
      {
        $group: {
          _id: {
            player: "$player",
            team: "$team",
            season: "$season",
          },
        },
      },
    ]),

    PlayerAppearanceModel.aggregate<AppearanceTeamAggregate>([
      {
        $match: {
          player: { $in: playerIds },
          ...(teamObjectId && {
            team: teamObjectId,
          }),
          ...(matchIds.length > 0 && {
            match: { $in: matchIds },
          }),
        },
      },
      {
        $group: {
          _id: {
            player: "$player",
            team: "$team",
            match: "$match",
          },
        },
      },
    ]),
  ]);

  // player-group -> teamIds
  const teamIdMap = new Map<string, Set<string>>();

  const addTeam = (
    playerId: Types.ObjectId,
    teamId: Types.ObjectId,
    groupId?: Types.ObjectId,
  ) => {
    const key = createStatisticsKey(playerId, groupId);

    const teamIds = teamIdMap.get(key) ?? new Set<string>();

    teamIds.add(teamId.toString());

    teamIdMap.set(key, teamIds);
  };

  // Registration
  for (const item of registrationStats) {
    const { player, team, season } = item._id;

    let groupId: Types.ObjectId | undefined;

    if (groupBy === PlayerStatisticsGroupBy.SEASON) {
      groupId = season;
    }

    if (groupBy === PlayerStatisticsGroupBy.TEAM) {
      groupId = team;
    }

    // competitionの場合はRegistrationだけでは
    // competitionを特定できないのでAppearance側で処理する
    if (
      groupBy === undefined ||
      groupBy === PlayerStatisticsGroupBy.SEASON ||
      groupBy === PlayerStatisticsGroupBy.TEAM
    ) {
      addTeam(player, team, groupId);
    }
  }

  // Appearance
  for (const item of appearanceStats) {
    const { player, team, match } = item._id;

    let groupId: Types.ObjectId | undefined;

    if (groupBy === PlayerStatisticsGroupBy.TEAM) {
      groupId = team;
    } else if (
      groupBy === PlayerStatisticsGroupBy.SEASON ||
      groupBy === PlayerStatisticsGroupBy.COMPETITION
    ) {
      const matchGroup = matchGroupMap.get(match.toString());

      if (groupBy === PlayerStatisticsGroupBy.SEASON) {
        groupId = matchGroup?.season;
      } else {
        groupId = matchGroup?.competition;
      }
    }
    addTeam(player, team, groupId);
  }

  if (teamIdMap.size === 0) {
    return new Map();
  }

  // 必要なTeam IDを全部集める
  const teamIds = [
    ...new Set([...teamIdMap.values()].flatMap((ids) => [...ids])),
  ].map((id) => new Types.ObjectId(id));

  // Teamを一括取得 + populate
  const teams = await TeamModel.aggregate<Team>([
    {
      $match: {
        _id: { $in: teamIds },
      },
    },
    ...getNest(false, TEAM_POPULATE_PATHS),
  ]);

  const teamMap = new Map(teams.map((team) => [team._id.toString(), team]));

  // player-group -> Team[]
  const result = new Map<string, Team[]>();

  for (const [key, ids] of teamIdMap) {
    const teams = [...ids]
      .map((id) => teamMap.get(id))
      .filter((team): team is Team => team !== undefined);

    result.set(key, teams);
  }

  return result;
};
