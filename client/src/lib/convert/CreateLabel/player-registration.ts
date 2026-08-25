import { PlayerRegistration } from "../../../types/models/player-registration";
import { season } from "./season";
import { team } from "./team";

export const playerRegistration = (t: PlayerRegistration): string => {
  return `${t.name} (${team(t.team)}) : ${t.registration_type} ${season(t.season)}`;
};
