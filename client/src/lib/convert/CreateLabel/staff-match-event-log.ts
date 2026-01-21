import { StaffMatchEventLog } from "../../../types/models/staff-match-event-log";

export const staffMatchEventLog = (t: StaffMatchEventLog): string => {
  return `${t.match}-${t.team}-${t.time_name}-${t.staff}-${t.match_event_type}`;
};
