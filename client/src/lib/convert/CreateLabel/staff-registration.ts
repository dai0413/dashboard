import { StaffRegistration } from "../../../types/models/staff-registration";
import { season } from "./season";
import { team } from "./team";

export const staffRegistration = (t: StaffRegistration): string => {
  return `${t.name} (${team(t.team)}) : ${t.registration_type} ${season(t.season)}`;
};
