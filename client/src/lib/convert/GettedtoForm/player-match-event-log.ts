import {
  PlayerMatchEventLogForm,
  PlayerMatchEventLogGet,
} from "../../../types/models/player-match-event-log";

export const playerMatchEventLog = (
  t: PlayerMatchEventLogGet,
): PlayerMatchEventLogForm => {
  return {
    ...t,
    match: t.match.id,
    team: t.team.id,
    match_event_type: t.match_event_type.id,
    player: t.player.id,
    player_name: !t.player.id ? t.player.label : undefined,
  };
};
