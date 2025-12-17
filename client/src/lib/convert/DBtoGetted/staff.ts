import { Staff, StaffGet } from "../../../types/models/staff";
import { player } from "../CreateLabel/player";
import { country } from "../CreateLabel/country";

export const staff = (t: Staff): StaffGet => {
  const dob = typeof t.dob === "string" ? new Date(t.dob) : t.dob;
  return {
    ...t,
    player: t.player
      ? {
          label: player(t.player),
          id: t.player?._id,
        }
      : undefined,
    citizenship: t.citizenship
      ? t.citizenship.map((c) => ({ label: country(c), id: c._id }))
      : undefined,
    dob,
  };
};
