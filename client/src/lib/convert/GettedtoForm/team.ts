import { TeamForm, TeamGet } from "../../../types/models/team";
import { ReverseGenreLabelMap } from "../DBtoGetted/team";

export const team = (t: TeamGet): TeamForm => ({
  ...t,
  genre: t.genre ? ReverseGenreLabelMap[t.genre] ?? "" : "",
});
