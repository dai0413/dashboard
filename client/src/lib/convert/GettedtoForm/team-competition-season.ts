import {
  TeamCompetitionSeasonForm,
  TeamCompetitionSeasonGet,
} from "../../../types/models/team-competition-season";

export const teamCompetitionSeason = (
  t: TeamCompetitionSeasonGet
): TeamCompetitionSeasonForm => ({
  ...t,
  team: t.team.id,
  competition: t.competition.id,
  season: t.season.id,
});
