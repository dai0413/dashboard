import { Team } from "../../../types/models/team";

export const team = (t: Team): string => {
  return `${t.team}` || `${t.enTeam}` || `${t.abbr}` || "";
};
