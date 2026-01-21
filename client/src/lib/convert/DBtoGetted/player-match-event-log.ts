import {
  PlayerMatchEventLog,
  PlayerMatchEventLogGet,
} from "../../../types/models/player-match-event-log";
import { player } from "../CreateLabel/player";
import { match } from "../CreateLabel/match";
import { team } from "../CreateLabel/team";
import { matchEventType } from "../CreateLabel/match-event-type";
import { Label } from "../../../types/types";

export const playerMatchEventLog = (
  t: PlayerMatchEventLog,
): PlayerMatchEventLogGet => {
  let player_obj: Label | null = null;

  if ("player" in t && t.player) {
    if (t.player._id) {
      player_obj = { label: player(t.player), id: t.player._id };
    } else {
      player_obj = { label: t.player.name || "", id: undefined };
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
    player: {
      label: player(t.player),
      id: t.player._id,
    },
  };
};
