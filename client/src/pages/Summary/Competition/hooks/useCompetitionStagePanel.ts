import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../types/models";
import { Data } from "../../../../types/types";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";

export const useCompetitionStagePanel = () => {
  const [competitionStages, setCompetitionStages] = useState<
    Data<GettedModelDataMap[ModelType.COMPETITION_STAGE]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readCompetitionStages = async (
    competitionId: string,
    seasonId?: string,
  ) => {
    if (!seasonId) return;
    const obj = await readItemsBase<
      ModelDataMap[ModelType.COMPETITION_STAGE][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.COMPETITION_STAGE.ROOT,
      params: {
        getAll: true,
        competition: competitionId,
        season: seasonId,
      },
      handleLoading: (time) => {
        setCompetitionStages((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.COMPETITION_STAGE, obj.data);

      setCompetitionStages({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    competitionStages,
    readCompetitionStages,
  };
};
