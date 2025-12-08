import { event_type } from "@dai0413/myorg-shared";
import {
  MatchEventTypeForm,
  MatchEventTypeGet,
} from "../../../types/models/match-event-type";

export const matchEventType = (t: MatchEventTypeGet): MatchEventTypeForm => {
  const eventType = event_type().find((item) => item.key === t.event_type)?.key;

  return {
    ...t,
    event_type: eventType ? eventType : "",
  };
};
