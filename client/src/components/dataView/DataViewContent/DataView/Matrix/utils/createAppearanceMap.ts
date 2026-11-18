import { PlayerAppearanceGet } from "../../../../../../types/models/player-appearance";

// playerId -> matchId -> PlayerAppearance
export const createAppearanceMap = (
  playerAppearances: PlayerAppearanceGet[],
): Map<string, Map<string, PlayerAppearanceGet>> => {
  const appearanceMap = new Map<string, Map<string, PlayerAppearanceGet>>();

  if (!playerAppearances || playerAppearances.length === 0)
    return appearanceMap;

  playerAppearances.forEach((appearance) => {
    const playerId = appearance.player.id;
    const matchId = appearance.match.id;

    if (!playerId || !matchId) return;

    const playerMap = appearanceMap.get(playerId) ?? new Map();

    playerMap.set(matchId, appearance);

    appearanceMap.set(playerId, playerMap);
  });

  return appearanceMap;
};
