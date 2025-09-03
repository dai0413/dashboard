import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonGet,
} from "../../../types/models/team-competition-season";

export const teamCompetitionSeason = (
  t: TeamCompetitionSeason
): TeamCompetitionSeasonGet => {
  return {
    ...t,
    team: {
      label: t.team.abbr || t.team.team,
      id: t.team._id,
    },
    season: {
      label: t.season.name,
      id: t.season._id,
    },
    competition: {
      label: t.competition.name,
      id: t.competition._id,
    },
  };
};
