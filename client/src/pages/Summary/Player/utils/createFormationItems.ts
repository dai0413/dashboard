import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { FormationItem } from "../../../../types/formation";
import { positionBase } from "../../../../components/formation/positionBase";

type OriginalData = Pick<PlayerStatistic, "positionCounts" | "appearances">;

export const createFormationItems = (
  statistics: OriginalData[],
): FormationItem[] => {
  const positionMap = new Map<FormationItem["position"], FormationItem>();

  statistics.forEach((statistic) => {
    for (const [key, value] of Object.entries(statistic.positionCounts)) {
      const position = key as FormationItem["position"];
      const point = positionBase[position];

      const existing = positionMap.get(position);

      if (existing) {
        existing.centerText = Number(existing.centerText) + (value || 0);
        existing.tooltip = [
          { text: key, bold: true },
          {
            text: `${existing.centerText}試合`,
          },
        ];
      } else {
        positionMap.set(position, {
          position,
          centerText: value,
          label: key,
          size: 24 + ((value || 0) / statistic.appearances) * 28,
          color: point.color,
          tooltip: [
            { text: key, bold: true },
            {
              text: `${value}試合`,
            },
          ],
        });
      }
    }
  });

  return Array.from(positionMap.values());
};
