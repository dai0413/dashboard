import {
  StaffAppearance,
  StaffAppearanceGet,
} from "../../../types/models/staff-appearance";
import { staff } from "../CreateLabel/staff";
import { match } from "../CreateLabel/match";
import { team } from "../CreateLabel/team";

export const staffAppearance = (t: StaffAppearance): StaffAppearanceGet => {
  return {
    ...t,
    match: {
      label: match(t.match),
      id: t.match._id,
    },
    staff: {
      label: staff(t.staff),
      id: t.staff._id,
    },
    team: {
      label: team(t.team),
      id: t.team._id,
    },
  };
};
