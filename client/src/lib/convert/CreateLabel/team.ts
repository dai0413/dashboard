import { Team } from "../../../types/models/team";

export const team = (t: Team): string => {
  return `${t.abbr}` || `${t.team}` || `${t.enTeam}` || "";
};
