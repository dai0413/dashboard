import { PlayerForm, PlayerGet } from "../../../types/models/player";
import { toDateKey } from "../../../utils";

export const player = (p: PlayerGet): PlayerForm => ({
  ...p,
  dob: p.dob ? toDateKey(p.dob) : "",
});
