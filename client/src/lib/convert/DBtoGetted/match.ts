import { Match, MatchGet } from "../../../types/models/match";

export const match = (t: Match): MatchGet => {
  const competition = {
    label: t.competition.abbr || t.competition.name,
    id: t.competition._id,
  };

  const competition_stage = {
    label: t.competition_stage.name || "",
    id: t.competition_stage._id,
  };

  const season = {
    label: t.season.name,
    id: t.season._id,
  };

  const home_team = {
    label: t.home_team ? t.home_team.abbr || t.home_team.team : "不明",
    id: t.home_team ? t.home_team._id : "",
  };

  const away_team = {
    label: t.away_team ? t.away_team.abbr || t.away_team.team : "不明",
    id: t.away_team ? t.away_team._id : "",
  };

  const match_format = t.match_format
    ? {
        label: t.match_format.name,
        id: t.match_format._id,
      }
    : undefined;

  const stadium = t.stadium
    ? {
        label: t.stadium.abbr || t.stadium.name,
        id: t.stadium._id,
      }
    : undefined;

  const date = typeof t.date === "string" ? new Date(t.date) : t.date;

  return {
    ...t,
    competition,
    competition_stage,
    season,
    home_team,
    away_team,
    match_format,
    stadium,
    date,
  };
};
