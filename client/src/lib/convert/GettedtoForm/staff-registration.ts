import { registrationStatus, registrationType } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import {
  StaffRegistrationForm,
  StaffRegistrationGet,
} from "../../../types/models/staff-registration";

export const staffRegistration = (
  t: StaffRegistrationGet,
): StaffRegistrationForm => {
  const registration_type = registrationType().find(
    (item) => item.label === t.registration_type,
  )?.key;
  const registration_status = registrationStatus().find(
    (item) => item.label === t.registration_status,
  )?.key;

  return {
    ...t,
    date: toDateKey(t.date),
    season: t.season.id,
    staff: t.staff.id,
    team: t.team.id,
    registration_type,
    registration_status,
  };
};
