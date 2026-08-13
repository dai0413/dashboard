import { PlayerRegistrationHistoryGet } from "../../../../../types/models/player-registration-history";

export const createRegistrationMap = (
  playerRegistrations: PlayerRegistrationHistoryGet[],
) => {
  const map = new Map<string, PlayerRegistrationHistoryGet[]>();

  for (const registration of playerRegistrations) {
    const key = `${registration.player.id}-${registration.competition.id}`;

    const registrations = map.get(key) ?? [];
    registrations.push(registration);

    map.set(key, registrations);
  }

  return map;
};
