import { Types } from "mongoose";
import { PlayerMatchEventLogModel } from "../../../models/player-match-event-log.js";
import { MatchGroupInfo } from "../types.js";
import { PlayerStatisticsGroupBy } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

type MatchEventLogAggregate = {
  _id: Types.ObjectId;
  groupId?: string;
  goals: number;
  assists: number;
};

type MatchEventLogMatchAggregate = {
  _id: {
    player: Types.ObjectId;
    match: Types.ObjectId;
    team: Types.ObjectId;
  };
  goals: number;
  assists: number;
};

type Params = {
  playerObjectIds: Types.ObjectId[];
  teamObjectId?: Types.ObjectId;
  matchIds: Types.ObjectId[];
  goalId: Types.ObjectId;
  assistId: Types.ObjectId;
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
};

export const getPlayerMatchEventLogStatistics = async ({
  playerObjectIds,
  teamObjectId,
  matchIds,
  goalId,
  assistId,
  groupBy,
  matchGroupMap,
}: Params): Promise<MatchEventLogAggregate[]> => {
  const matchAggregates =
    await PlayerMatchEventLogModel.aggregate<MatchEventLogMatchAggregate>([
      {
        $match: {
          player: { $in: playerObjectIds },
          ...(teamObjectId && { team: teamObjectId }),
          ...(matchIds.length > 0 && { match: { $in: matchIds } }),
        },
      },
      {
        $group: {
          _id: {
            player: "$player",
            match: "$match",
            team: "$team",
          },
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
    ]);

  const resultMap = new Map<string, MatchEventLogAggregate>();

  for (const item of matchAggregates) {
    const { player, match, team } = item._id;

    let groupId: Types.ObjectId | undefined;

    if (groupBy === PlayerStatisticsGroupBy.SEASON) {
      groupId = matchGroupMap.get(match.toString())?.season;
    }

    if (groupBy === PlayerStatisticsGroupBy.COMPETITION) {
      groupId = matchGroupMap.get(match.toString())?.competition;
    }

    if (groupBy === PlayerStatisticsGroupBy.TEAM) {
      groupId = team;
    }

    const key = groupId
      ? `${player.toString()}-${groupId.toString()}`
      : player.toString();

    const current = resultMap.get(key);

    if (current) {
      current.goals += item.goals;
      current.assists += item.assists;
    } else {
      const newValue: MatchEventLogAggregate = {
        _id: player,
        goals: item.goals,
        assists: item.assists,
      };

      if (groupId && groupBy) {
        newValue["groupId"] = groupId.toString();
      }
      resultMap.set(key, newValue);
    }
  }

  return [...resultMap.values()];
};
