import { Staff, StaffGet } from "../../../types/models/staff";
import { player } from "../CreateLabel/player";

export const staff = (t: Staff): StaffGet => {
  return {
    ...t,
    player: t.player
      ? {
          label: player(t.player),
          id: t.player?._id,
        }
      : undefined,
  };
};
