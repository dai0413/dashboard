import { StaffForm, StaffGet } from "../../../types/models/staff";
import { toDateKey } from "../../../utils";

export const staff = (t: StaffGet): StaffForm => ({
  ...t,
  dob: toDateKey(t.dob),
  player: t.player ? t.player.id : undefined,
  citizenship: t.citizenship ? t.citizenship.map((c) => c.id || "") : undefined,
});
