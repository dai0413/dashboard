import { event_type } from "@dai0413/myorg-shared";
import {
  MatchEventType,
  MatchEventTypeGet,
} from "../../../types/models/match-event-type";

export const matchEventType = (p: MatchEventType): MatchEventTypeGet => {
  const eventType = event_type().find(
    (item) => item.key === p.event_type
  )?.label;

  return {
    ...p,
    event_type: eventType ? eventType : "",
  };
};
