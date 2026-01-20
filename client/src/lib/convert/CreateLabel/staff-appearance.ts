import { StaffAppearance } from "../../../types/models/staff-appearance";

export const staffAppearance = (t: StaffAppearance): string => {
  return `${t.match}-${t.team}-${t.staff}`;
};
