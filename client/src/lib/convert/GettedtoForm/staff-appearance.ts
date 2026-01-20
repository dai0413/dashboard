import {
  StaffAppearanceForm,
  StaffAppearanceGet,
} from "../../../types/models/staff-appearance";

export const staffAppearance = (t: StaffAppearanceGet): StaffAppearanceForm => {
  return {
    ...t,
    match: t.match.id,
    staff: t.staff.id,
    team: t.team.id,
  };
};
