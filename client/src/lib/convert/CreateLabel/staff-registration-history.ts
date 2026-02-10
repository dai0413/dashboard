import { StaffRegistrationHistory } from "../../../types/models/staff-registration-history";

export const staffRegistrationHistory = (
  t: StaffRegistrationHistory,
): string => {
  return `${t.season}-${t.team}-${t.changes?.name}`;
};
