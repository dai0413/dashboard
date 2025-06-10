import { PlayerForm, PlayerGet } from "../../../types/models/player";

export const player = (p: PlayerGet): PlayerForm => ({
  ...p,
  dob: p.dob ? p.dob?.toISOString() : "",
});
