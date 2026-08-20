import { Types } from "mongoose";
import { PlayerAppearanceModel } from "../../../../models/player-appearance.js";
import { MatchGroupInfo } from "../types.js";
import { PlayerStatisticsGroupBy } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

type AppearanceAggregate = {
  _id: Types.ObjectId;
  groupId?: string;
  starts: number;
  subs: number;
  bench: number;
  minutes: number;
  positions: string[];
};

type AppearanceMatchAggregate = {
  _id: {
    player: Types.ObjectId;
    match: Types.ObjectId;
    team: Types.ObjectId;
  };
  starts: number;
  subs: number;
  bench: number;
  minutes: number;
  positions: string[];
};

type Params = {
  playerObjectIds: Types.ObjectId[];
  teamObjectId?: Types.ObjectId;
  matchIds: Types.ObjectId[];
  groupBy?: PlayerStatisticsGroupBy;
  matchGroupMap: Map<string, MatchGroupInfo>;
};

export const getPlayerAppearanceStatistics = async ({
  playerObjectIds,
  teamObjectId,
  matchIds,
  groupBy,
  matchGroupMap,
}: Params): Promise<AppearanceAggregate[]> => {
  const matchAggregates =
    await PlayerAppearanceModel.aggregate<AppearanceMatchAggregate>([
      {
        $match: {
          player: { $in: playerObjectIds },
          ...(teamObjectId && { team: teamObjectId }),
          ...(matchIds.length > 0 && {
            match: { $in: matchIds },
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
          starts: {
            $sum: {
              $cond: [{ $eq: ["$play_status", "start"] }, 1, 0],
            },
          },
          subs: {
            $sum: {
              $cond: [{ $eq: ["$play_status", "sub"] }, 1, 0],
            },
          },
          bench: {
            $sum: {
              $cond: [{ $eq: ["$play_status", "bench"] }, 1, 0],
            },
          },
          minutes: {
            $sum: "$time",
          },
          positions: {
            $push: "$position",
          },
        },
      },
    ]);

  const resultMap = new Map<string, AppearanceAggregate>();

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
      current.starts += item.starts;
      current.subs += item.subs;
      current.bench += item.bench;
      current.minutes += item.minutes;
      current.positions.push(...item.positions);
    } else {
      const newValue: AppearanceAggregate = {
        _id: player,
        starts: item.starts,
        subs: item.subs,
        bench: item.bench,
        minutes: item.minutes,
        positions: [...item.positions],
      };

      if (groupId && groupBy) {
        newValue["groupId"] = groupId.toString();
      }
      resultMap.set(key, newValue);
    }
  }

  return [...resultMap.values()];
};
