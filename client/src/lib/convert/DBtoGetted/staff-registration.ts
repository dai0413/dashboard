import { registrationStatus, registrationType } from "@dai0413/myorg-shared";
import {
  StaffRegistration,
  StaffRegistrationGet,
} from "../../../types/models/staff-registration";
import { competition } from "../CreateLabel/competition";
import { staff } from "../CreateLabel/staff";
import { season } from "../CreateLabel/season";
import { team } from "../CreateLabel/team";

export const staffRegistration = (
  t: StaffRegistration,
): StaffRegistrationGet => {
  const registration_type = registrationType().find(
    (item) => item.key === t.registration_type,
  )?.label;

  const registration_status = registrationStatus().find(
    (item) => item.key === t.registration_status,
  )?.label;

  return {
    ...t,
    date: typeof t.date === "string" ? new Date(t.date) : t.date,
    season: {
      label: season(t.season),
      id: t.season._id,
    },
    competition: {
      label: competition(t.competition),
      id: t.competition._id,
    },
    staff: {
      label: staff(t.staff),
      id: t.staff._id,
    },
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    registration_type: registration_type ? registration_type : "",
    registration_status: registration_status ? registration_status : "",
  };
};
