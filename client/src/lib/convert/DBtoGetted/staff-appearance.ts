import {
  StaffAppearance,
  StaffAppearanceGet,
} from "../../../types/models/staff-appearance";
import { staff } from "../CreateLabel/staff";
import { match } from "../CreateLabel/match";
import { team } from "../CreateLabel/team";
import { Label } from "../../../types/types";

export const staffAppearance = (t: StaffAppearance): StaffAppearanceGet => {
  let staff_obj: Label;

  if (t.staff) {
    staff_obj = { label: staff(t.staff), id: t.staff._id };
  } else {
    staff_obj = { label: t.staff_name || "", id: undefined };
  }
  return {
    ...t,
    match: {
      label: match(t.match),
      id: t.match._id,
    },
    staff: staff_obj,
    team: {
      label: team(t.team),
      id: t.team._id,
    },
  };
};
