import { registrationStatus, registrationType } from ""@dai0413/myorg-shared";
import {
  PlayerRegistration,
  PlayerRegistrationGet,
} from "../../../types/models/player-registration";
import { competition } from "../CreateLabel/competition";
import { player } from "../CreateLabel/player";
import { season } from "../CreateLabel/season";
import { team } from "../CreateLabel/team";

export const playerRegistration = (
  t: PlayerRegistration
): PlayerRegistrationGet => {
  const registration_type = registrationType().find(
    (item) => item.key === t.registration_type
  )?.label;

  const registration_status = registrationStatus().find(
    (item) => item.key === t.registration_status
  )?.label;

  return {
    ...t,
    date: typeof t.date === "string" ? new Date(t.date) : t.date,
    season: {
      label: season(t.season),
      id: t.season._id,
    },
    competition: {
      label: competition(t.competition),
      id: t.competition._id,
    },
    player: {
      label: player(t.player),
      id: t.player._id,
    },
    team: {
      label: team(t.team),
      id: t.team._id,
    },
    registration_type: registration_type ? registration_type : "",
    registration_status: registration_status ? registration_status : "",
  };
};
