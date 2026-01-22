import {
  StaffAppearanceForm,
  StaffAppearanceGet,
} from "../../../types/models/staff-appearance";

export const staffAppearance = (t: StaffAppearanceGet): StaffAppearanceForm => {
  const staff_name = t.staff && !t.staff.id ? t.staff.label : undefined;

  return {
    ...t,
    match: t.match.id,
    staff: t.staff.id ? t.staff.id : undefined,
    staff_name,
    team: t.team.id,
  };
};
