import {
  PlayerRegistrationHistoryForm,
  PlayerRegistrationHistoryGet,
} from "../../../types/models/player-registration-history";
import { toDateKey } from "../../../utils";
import { registrationType } from "../../../utils/createOption/Enum/registration_type";

export const playerRegistrationHistory = (
  t: PlayerRegistrationHistoryGet
): PlayerRegistrationHistoryForm => {
  const registration_type = registrationType().find(
    (item) => item.label === t.registration_type
  )?.key;

  return {
    ...t,
    date: t.date ? toDateKey(t.date) : "",
    season: t.season.id,
    player: t.player.id,
    team: t.team.id,
    registration_type,
  };
};
