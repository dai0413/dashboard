import { play_status } from "@dai0413/myorg-shared";
import {
  PlayerAppearanceForm,
  PlayerAppearanceGet,
} from "../../../types/models/player-appearance";

export const playerAppearance = (
  t: PlayerAppearanceGet,
): PlayerAppearanceForm => {
  const playStatus = play_status().find(
    (item) => item.label === t.play_status,
  )?.key;

  const player_name = t.player && !t.player.id ? t.player.label : undefined;

  return {
    ...t,
    match: t.match.id,
    player: t.player.id ? t.player.id : undefined,
    player_name,
    team: t.team.id,
    play_status: playStatus,
  };
};
