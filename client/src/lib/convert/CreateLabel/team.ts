import { Team } from "../../../types/models/team";

export const team = (t: Team): string => {
  if (t.abbr) return t.abbr;
  if (t.team) return t.team;
  if (t.enTeam) return t.enTeam;
  return "";
};
