import { Player, PlayerGet } from "../../types/models/player";

export const transformPlayer = (p: Player): PlayerGet => ({
  ...p,
  dob: typeof p.dob === "string" ? new Date(p.dob) : p.dob,
});
