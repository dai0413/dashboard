import {
  PlayerMatchEventLogForm,
  PlayerMatchEventLogGet,
} from "../../../types/models/player-match-event-log";

export const playerMatchEventLog = (
  t: PlayerMatchEventLogGet,
): PlayerMatchEventLogForm => {
  const player_name = t.player && !t.player.id ? t.player.label : undefined;

  return {
    ...t,
    match: t.match.id,
    team: t.team.id,
    match_event_type: t.match_event_type.id,
    player: t.player.id ? t.player.id : undefined,
    player_name,
  };
};
