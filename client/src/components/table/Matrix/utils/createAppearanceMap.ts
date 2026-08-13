import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";

// playerId-matchId -> PlayerAppearance
export const createAppearanceMap = (
  playerAppearance: PlayerAppearanceGet[],
): Map<string, PlayerAppearanceGet> => {
  const appearanceMap = new Map<string, PlayerAppearanceGet>();

  playerAppearance.forEach((appearance) => {
    if (!appearance.match.id) return;

    appearanceMap.set(
      `${appearance.player.id}-${appearance.match.id}`,
      appearance,
    );
  });

  return appearanceMap;
};
