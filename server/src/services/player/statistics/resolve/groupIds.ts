import { Types } from "mongoose";
import { PlayerStatisticsGroupBy } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatchGroupInfo } from "../types.js";

export const resolveStatisticsGroupIds = ({
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
