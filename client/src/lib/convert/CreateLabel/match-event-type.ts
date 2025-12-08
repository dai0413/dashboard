import { MatchEventType } from "../../../types/models/match-event-type";

export const matchEventType = (t: MatchEventType): string => {
  return `${t.name}`;
};
