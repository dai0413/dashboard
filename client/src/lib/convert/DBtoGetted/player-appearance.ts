import { play_status } from "@dai0413/myorg-shared";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../types/models/player-appearance";
import { player } from "../CreateLabel/player";
import { match } from "../CreateLabel/match";
import { team } from "../CreateLabel/team";

export const playerAppearance = (t: PlayerAppearance): PlayerAppearanceGet => {
  const playStatus = play_status().find(
    (item) => item.key === t.play_status,
  )?.label;

  return {
    ...t,
    match: {
      label: match(t.match),
      id: t.match._id,
    },
    player: {
      label: player(t.player),
      id: t.player._id,
    },
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    play_status: playStatus ? playStatus : "",
  };
};
