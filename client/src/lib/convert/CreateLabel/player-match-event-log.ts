import { PlayerMatchEventLog } from "../../../types/models/player-match-event-log";

export const playerMatchEventLog = (t: PlayerMatchEventLog): string => {
  return `${t.match}-${t.team}-${t.time_name}-${t.player}-${t.match_event_type}`;
};
