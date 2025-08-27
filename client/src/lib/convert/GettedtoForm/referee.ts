import { RefereeForm, RefereeGet } from "../../../types/models/referee";

export const referee = (t: RefereeGet): RefereeForm => ({
  ...t,
  dob: t.dob ? t.dob.toISOString() : "",
  player: t.player.id,
  citizenship: t.citizenship.map((c) => c.id),
});
