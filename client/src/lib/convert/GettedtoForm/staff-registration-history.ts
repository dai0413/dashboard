import { registrationType } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import {
  StaffRegistrationHistoryForm,
  StaffRegistrationHistoryGet,
} from "../../../types/models/staff-registration-history";

export const staffRegistrationHistory = (
  t: StaffRegistrationHistoryGet,
): StaffRegistrationHistoryForm => {
  const registration_type = registrationType().find(
    (item) => item.label === t.registration_type,
  )?.key;

  return {
    ...t,
    date: toDateKey(t.date),
    season: t.season.id,
    staff: t.staff.id,
    team: t.team.id,
    registration_type,
  };
};
