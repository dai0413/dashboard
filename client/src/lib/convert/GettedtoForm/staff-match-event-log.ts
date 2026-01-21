import {
  StaffMatchEventLogForm,
  StaffMatchEventLogGet,
} from "../../../types/models/staff-match-event-log";

export const staffMatchEventLog = (
  t: StaffMatchEventLogGet,
): StaffMatchEventLogForm => {
  return {
    ...t,
    match: t.match.id,
    team: t.team.id,
    match_event_type: t.match_event_type.id,
    staff: t.staff.id,
    staff_name: !t.staff.id ? t.staff.label : undefined,
  };
};
