import { TeamForm, TeamGet } from "../../../types/models/team";

export const team = (t: TeamGet): TeamForm => ({
  ...t,
});
