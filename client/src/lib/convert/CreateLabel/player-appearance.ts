import { PlayerAppearance } from "../../../types/models/player-appearance";

export const playerAppearance = (t: PlayerAppearance): string => {
  return `${t.match}-${t.team}-${t.player}`;
};
