import {
  PlayerRegistrationHistory,
  PlayerRegistrationHistoryGet,
} from "../../../types/models/player-registration-history";
import { competition } from "../CreateLabel/competition";
import { player } from "../CreateLabel/player";
import { season } from "../CreateLabel/season";
import { team } from "../CreateLabel/team";
import { registrationType } from "../../../utils/createOption/Enum/registration_type";

export const playerRegistrationHistory = (
  t: PlayerRegistrationHistory
): PlayerRegistrationHistoryGet => {
  const registration_type = registrationType().find(
    (item) => item.key === t.registration_type
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
  };
};
