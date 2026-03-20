import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { RefereeForm, RefereeGet } from "../../../types/models/referee";

export const referee = (t: RefereeGet): RefereeForm => ({
  ...t,
  dob: toDateKey(t.dob),
  player: t.player ? t.player.id : undefined,
  citizenship: t.citizenship
    .map((c) => c.id)
    .filter((id): id is string => typeof id === "string"),
});
