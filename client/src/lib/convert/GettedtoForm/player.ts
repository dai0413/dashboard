import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { PlayerForm, PlayerGet } from "../../../types/models/player";

export const player = (p: PlayerGet): PlayerForm => ({
  ...p,
  dob: toDateKey(p.dob),
});
