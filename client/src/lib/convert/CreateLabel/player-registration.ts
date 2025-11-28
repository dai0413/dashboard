import { PlayerRegistration } from "../../../types/models/player-registration";

export const playerRegistration = (t: PlayerRegistration): string => {
  return `${t.season}-${t.team}-${t.name}`;
};
