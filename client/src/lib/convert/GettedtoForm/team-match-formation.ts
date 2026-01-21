import {
  TeamMatchFormationForm,
  TeamMatchFormationGet,
} from "../../../types/models/team-match-formation";

export const teamMatchFormation = (
  t: TeamMatchFormationGet,
): TeamMatchFormationForm => ({
  ...t,
  team: t.team.id,
  match: t.match.id,
  formation: t.formation.id,
});
