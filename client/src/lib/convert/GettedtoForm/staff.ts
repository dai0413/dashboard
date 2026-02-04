import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { StaffForm, StaffGet } from "../../../types/models/staff";

export const staff = (t: StaffGet): StaffForm => ({
  ...t,
  dob: toDateKey(t.dob),
  player: t.player ? t.player.id : undefined,
  citizenship: t.citizenship ? t.citizenship.map((c) => c.id || "") : undefined,
});
