import { InjuryGet } from "../../../../../../../types/models/injury";

// playerId -> InjuryGet[]
export const createInjuryMap = (
  injuries: InjuryGet[],
): Map<string, InjuryGet[]> => {
  const injuryMap = new Map<string, InjuryGet[]>();

  injuries.forEach((injury) => {
    const key = injury.player.id;
    if (!key) return;

    const current = injuryMap.get(key) ?? [];

    injuryMap.set(key, [...current, injury]);
  });

  return injuryMap;
};
