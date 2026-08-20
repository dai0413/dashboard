import { Types } from "mongoose";
import { competition, team, season } from "@dai0413/myorg-shared/models-config";
import { PlayerStatisticsGroupBy } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { getNest } from "../../../../controllers/helpers/getNest.js";
import { TeamModel } from "../../../../models/team.js";
import { CompetitionModel } from "../../../../models/competition.js";
import { SeasonModel } from "../../../../models/season.js";

const modelsConfig = {
  competition,
  team,
  season,
};

export const resolveStatisticsGroup = async ({
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
