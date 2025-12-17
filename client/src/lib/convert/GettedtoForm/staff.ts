import { StaffForm, StaffGet } from "../../../types/models/staff";
import { toDateKey } from "../../../utils";

export const staff = (t: StaffGet): StaffForm => ({
  ...t,
  dob: t.dob ? toDateKey(t.dob, true) : "",
  player: t.player ? t.player.id : undefined,
});
