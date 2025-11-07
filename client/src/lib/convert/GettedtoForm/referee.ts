import { RefereeForm, RefereeGet } from "../../../types/models/referee";
import { toDateKey } from "../../../utils";

export const referee = (t: RefereeGet): RefereeForm => ({
  ...t,
  dob: t.dob ? toDateKey(t.dob) : "",
  player: t.player.id,
  citizenship: t.citizenship
    .map((c) => c.id)
    .filter((id): id is string => typeof id === "string"),
});
