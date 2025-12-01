import { PlayerRegistrationHistory } from "../../../types/models/player-registration-history";

export const playerRegistrationHistory = (
  t: PlayerRegistrationHistory
): string => {
  return `${t.season}-${t.team}-${t.changes?.name}`;
};
