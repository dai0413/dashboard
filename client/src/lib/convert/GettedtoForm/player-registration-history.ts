import { registrationType } from "@dai0413/myorg-shared";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import {
  PlayerRegistrationHistoryForm,
  PlayerRegistrationHistoryGet,
} from "../../../types/models/player-registration-history";

export const playerRegistrationHistory = (
  t: PlayerRegistrationHistoryGet,
): PlayerRegistrationHistoryForm => {
  const registration_type = registrationType().find(
    (item) => item.label === t.registration_type,
  )?.key;

  return {
    ...t,
    date: toDateKey(t.date),
    competition: t.competition.id,
    season: t.season.id,
    player: t.player.id,
    team: t.team.id,
    registration_type,
  };
};
