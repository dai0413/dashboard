import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/position";
import { AxiosInstance } from "axios";
import { ReadPosition } from "./types";
import { Match } from "../../../../../../types/models/match";
import { PlayerAppearanceForm } from "../../../../../../types/models/player-appearance";

export const applyPositions = async (
  api: AxiosInstance,
  formDatas: PlayerAppearanceForm[],
  formLabels: Record<string, any>[],
  readPosition: ReadPosition,
): Promise<{
  formDatas: PlayerAppearanceForm[];
  formLabels: Record<string, any>[];
}> => {
  const matchCache = new Map<string, Promise<Match | undefined>>();
  const scrapedCache = new Map<string, Promise<Scraped | undefined>>();

  const applied = await Promise.all(
    formDatas.map(async (formData, i) => {
      const formLabel = formLabels[i];

      const position = await readPosition(
        api,
        matchCache,
        scrapedCache,
        formData,
      );

      return {
        formData: {
          ...formData,
          ...(position !== undefined && { position }),
        },
        formLabel: {
          ...formLabel,
          ...(position !== undefined && { position }),
        },
      };
    }),
  );

  return {
    formDatas: applied.map(({ formData }) => formData),
    formLabels: applied.map(({ formLabel }) => formLabel),
  };
};
