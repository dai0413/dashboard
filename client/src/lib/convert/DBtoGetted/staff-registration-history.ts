import { registrationType } from "@dai0413/myorg-shared";
import {
  StaffRegistrationHistory,
  StaffRegistrationHistoryGet,
} from "../../../types/models/staff-registration-history";
import { competition } from "../CreateLabel/competition";
import { staff } from "../CreateLabel/staff";
import { season } from "../CreateLabel/season";
import { team } from "../CreateLabel/team";

export const staffRegistrationHistory = (
  t: StaffRegistrationHistory,
): StaffRegistrationHistoryGet => {
  const registration_type = registrationType().find(
    (item) => item.key === t.registration_type,
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
    changes: {
      ...t.changes,
    },
  };
};
