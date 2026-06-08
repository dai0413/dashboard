import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/draftData";

const mergeTeamPosition = (
  appearances: NonNullable<Scraped[any]["playerAppearance"]>["home"],
  positions: NonNullable<Scraped[any]["positions"]>["home"],
) => {
  positions.forEach((positionData) => {
    const idx = appearances.findIndex(
      (scraped) => scraped.number === positionData.number,
    );

    if (idx >= 0) {
      appearances[idx].position = positionData.position;
    }
  });
};

const mergePosition = (
  playerAppearance: Scraped[any]["playerAppearance"],
  positions: Scraped[any]["positions"],
): Scraped[any]["playerAppearance"] | undefined => {
  const home = playerAppearance?.home || [];
  const away = playerAppearance?.away || [];

  mergeTeamPosition(home, positions?.home || []);
  mergeTeamPosition(away, positions?.away || []);

  return { home, away };
};

export const mergePositions = (draftData: Scraped): Scraped => {
  const result: Scraped = {};

  for (const [key, item] of Object.entries(draftData)) {
    result[key] = {
      ...item,
      playerAppearance:
        item.playerAppearance && item.positions
          ? mergePosition(item.playerAppearance, item.positions)
          : item.playerAppearance,
    };
  }

  return result;
};
