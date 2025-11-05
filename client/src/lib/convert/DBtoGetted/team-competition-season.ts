import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonGet,
} from "../../../types/models/team-competition-season";
import { competition } from "../CreateLabel/competition";
import { team } from "../CreateLabel/team";

export const teamCompetitionSeason = (
  t: TeamCompetitionSeason
): TeamCompetitionSeasonGet => {
  return {
    ...t,
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    season: {
      label: `${competition(t.competition)}-${t.season.name}`,
      id: t.season._id,
    },
    competition: {
      label: competition(t.competition),
      id: t.competition._id,
    },
  };
};
