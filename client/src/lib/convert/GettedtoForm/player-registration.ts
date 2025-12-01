import { registrationStatus, registrationType } from "@dai0413/myorg-shared";
import {
  PlayerRegistrationForm,
  PlayerRegistrationGet,
} from "../../../types/models/player-registration";
import { toDateKey } from "../../../utils";

export const playerRegistration = (
  t: PlayerRegistrationGet
): PlayerRegistrationForm => {
  const registration_type = registrationType().find(
    (item) => item.label === t.registration_type
  )?.key;
  const registration_status = registrationStatus().find(
    (item) => item.label === t.registration_status
  )?.key;

  return {
    ...t,
    date: t.date ? toDateKey(t.date) : "",
    season: t.season.id,
    player: t.player.id,
    team: t.team.id,
    registration_type,
    registration_status,
  };
};
