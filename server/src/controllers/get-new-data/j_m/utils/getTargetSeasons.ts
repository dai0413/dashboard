import { SeasonModel } from "../../../../models/season.js";
import { TeamCompetitionSeasonModel } from "../../../../models/team-competition-season.js";

export const getTargetSeasons = async (
  season: string,
  homeTeamId?: string,
  awayTeamId?: string,
  date?: Date,
): Promise<{ home: string[]; away: string[] }> => {
  if (typeof date === "undefined") return { home: [season], away: [season] };

  // dateに一致するseason取得
  const seasons = await SeasonModel.find({
    start_date: { $lte: date },
    end_date: { $gte: date },
  })
    .select("_id")
    .lean();

  const seasonIds = seasons.map((s) => s._id.toString());

  const getSeasonIds = async (teamId?: string): Promise<string[]> => {
    if (!teamId) return [];

    const result = await TeamCompetitionSeasonModel.find({
      team: teamId,
      season: { $in: seasonIds },
    })
      .select("season")
      .lean();

    return result.map((r) => r.season.toString());
  };

  const [home, away] = await Promise.all([
    getSeasonIds(homeTeamId),
    getSeasonIds(awayTeamId),
  ]);

  return {
    home: [...new Set([season, ...home])],
    away: [...new Set([season, ...away])],
  };
};
