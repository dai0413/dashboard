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

export const useHomeStatsLPanel = () => {
  const [homeStatsL, setHomeStatsL] = useState<
    Data<GettedModelDataMap[ModelType.STATS_L]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readHomeStatsL = async (matchId?: string, teamId?: string) => {
    if (!matchId || !teamId) return;
    const obj = await readItemsBase<ModelDataMap[ModelType.STATS_L][]>({
      apiInstance: api,
      backendRoute: API_PATHS.STATS_L.ROOT,
      params: {
        getAll: true,
        match: matchId,
        team: [teamId],
      },
      handleLoading: (time) => {
        setHomeStatsL((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.STATS_L, obj.data);

      setHomeStatsL({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    homeStatsL,
    readHomeStatsL,
  };
};
