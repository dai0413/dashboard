import { MatchGet } from "../../../../../types/models/match";
import { PlayerRegistrationHistoryGet } from "../../../../../types/models/player-registration-history";

export const isRegisteredAtMatch = (
  registrations: PlayerRegistrationHistoryGet[] | undefined,
  match: MatchGet,
): boolean => {
  if (!match.date || !registrations) {
    return false;
  }

  return registrations.some(
    (registration) =>
      registration.registration_type === "登録" &&
      !!registration.date &&
      !!match.date &&
      match.date.getTime() >= registration.date.getTime(),
  );
};
