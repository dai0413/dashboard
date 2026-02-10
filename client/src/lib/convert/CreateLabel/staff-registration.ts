import { StaffRegistration } from "../../../types/models/staff-registration";

export const staffRegistration = (t: StaffRegistration): string => {
  return `${t.season}-${t.team}-${t.name}`;
};
