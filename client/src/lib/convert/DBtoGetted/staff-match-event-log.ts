import {
  StaffMatchEventLog,
  StaffMatchEventLogGet,
} from "../../../types/models/staff-match-event-log";
import { staff } from "../CreateLabel/staff";
import { match } from "../CreateLabel/match";
import { team } from "../CreateLabel/team";
import { matchEventType } from "../CreateLabel/match-event-type";
import { Label } from "../../../types/types";

export const staffMatchEventLog = (
  t: StaffMatchEventLog,
): StaffMatchEventLogGet => {
  let staff_obj: Label | null = null;

  if ("staff" in t && t.staff) {
    if (t.staff._id) {
      staff_obj = { label: staff(t.staff), id: t.staff._id };
    } else {
      staff_obj = { label: t.staff.name || "", id: undefined };
    }
  }

  return {
    ...t,
    match: {
      label: match(t.match),
      id: t.match._id,
    },
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    match_event_type: {
      label: matchEventType(t.match_event_type),
      id: t.match_event_type._id,
    },
    staff: {
      label: staff(t.staff),
      id: t.staff._id,
    },
  };
};
