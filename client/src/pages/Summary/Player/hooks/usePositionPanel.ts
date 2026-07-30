import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";
import { FormationItem } from "../../../../types/formation";
import { PlayerAppearance } from "../../../../types/models/player-appearance";
import { positionBase } from "../../../../components/formation/positionBase";

export const usePositionPanel = () => {
  const [positions, setPotitions] = useState<FormationItem[]>([]);
  const [positionsIsLoading, setPositionsIsLoading] = useState<boolean>(false);

  const readPositions = async (id: string) => {
    setPositionsIsLoading(true);

    const obj = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: { getAll: true, player: id },
    });

    if (obj?.data) {
      const converted = convert(ModelType.PLAYER_APPEARANCE, obj.data);
      const withPositions = converted.filter((a) => a.position);
      const total = withPositions.length;

      const stats = new Map<
        string,
        {
          count: number;
          minutes: number;
        }
      >();

      for (const appearance of withPositions) {
        if (!appearance.position) continue;

        const stat = stats.get(appearance.position) ?? {
          count: 0,
          minutes: 0,
        };

        stat.count++;
        stat.minutes += appearance.time ?? 0;

        stats.set(appearance.position, stat);
      }

      const items: FormationItem[] = Array.from(stats.entries()).map(
        ([position, stat]) => {
          const point = positionBase[position as keyof typeof positionBase];

          return {
            position: position as keyof typeof positionBase,

            centerText: stat.count,

            label: position,

            size: 24 + (stat.count / total) * 28,

            color: point.color,

            tooltip: [
              {
                text: position,
                bold: true,
              },
              {
                text: `${stat.count}試合`,
              },
              {
                text: `${stat.minutes}分`,
              },
            ],
          };
        },
      );

      setPotitions(items);
    }

    setPositionsIsLoading(false);
  };

  return {
    positions,
    positionsIsLoading,
    readPositions,
  };
};
