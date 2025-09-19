import { MatchForm, MatchGet } from "../../../types/models/match";

export const match = (t: MatchGet): MatchForm => {
  const { competition, season, ...dat } = t;
  return {
    ...dat,
    date: t.date ? t.date.toISOString() : "",
    competition_stage: t.competition_stage.id,
    home_team: t.home_team.id,
    away_team: t.away_team.id,
    match_format: t.match_format ? t.match_format.id : undefined,
    stadium: t.stadium ? t.stadium.id : undefined,
  };
};
