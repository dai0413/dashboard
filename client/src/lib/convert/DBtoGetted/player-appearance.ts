import { play_status } from "@dai0413/myorg-shared";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../types/models/player-appearance";
import { player } from "../CreateLabel/player";
import { match } from "../CreateLabel/match";
import { team } from "../CreateLabel/team";
import { Label } from "../../../types/types";

export const playerAppearance = (t: PlayerAppearance): PlayerAppearanceGet => {
  let player_obj: Label;

  if (t.player) {
    player_obj = { label: player(t.player), id: t.player._id };
  } else {
    player_obj = { label: t.player_name || "", id: undefined };
  }

  const playStatus = play_status().find(
    (item) => item.key === t.play_status,
  )?.label;

  return {
    ...t,
    match: {
      label: match(t.match),
      id: t.match._id,
    },
    player: player_obj,
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    play_status: playStatus ? playStatus : "",
  };
};
