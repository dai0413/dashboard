import { TeamMatchFormation } from "../../../types/models/team-match-formation";

export const teamMatchFormation = (t: TeamMatchFormation): string => {
  return `${t.match}-${t.team}-${t.formation}`;
};
