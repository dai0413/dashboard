import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { PlayerForm, PlayerGet } from "../../../types/models/player";

export const player = (p: PlayerGet): PlayerForm => {
  const citizenship = p.citizenship
    ?.map((c) => c.id)
    .filter((c) => typeof c === "string");

  return {
    ...p,
    dob: toDateKey(p.dob),
    citizenship,
  };
};
