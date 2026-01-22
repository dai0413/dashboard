import {
  StaffMatchEventLogForm,
  StaffMatchEventLogGet,
} from "../../../types/models/staff-match-event-log";

export const staffMatchEventLog = (
  t: StaffMatchEventLogGet,
): StaffMatchEventLogForm => {
  const staff_name = t.staff && !t.staff.id ? t.staff.label : undefined;

  return {
    ...t,
    match: t.match.id,
    team: t.team.id,
    match_event_type: t.match_event_type.id,
    staff: t.staff.id ? t.staff.id : undefined,
    staff_name,
  };
};
