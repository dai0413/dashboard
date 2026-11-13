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

export const useAwayStatsLPanel = () => {
  const [awayStatsL, setAwayStatsL] = useState<
    Data<GettedModelDataMap[ModelType.STATS_L]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readAwayStatsL = async (
    matchId?: string,
    teamId?: string,
  ): Promise<Data<GettedModelDataMap[ModelType.STATS_L]> | null> => {
    if (!matchId || !teamId) return null;

    const obj = await readItemsBase<ModelDataMap[ModelType.STATS_L][]>({
      apiInstance: api,
      backendRoute: API_PATHS.STATS_L.ROOT,
      params: {
        getAll: true,
        match: matchId,
        team: [teamId],
      },
      handleLoading: (time) => {
        setAwayStatsL((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.STATS_L, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setAwayStatsL(nextItems);

    return nextItems;
  };

  return {
    awayStatsL,
    readAwayStatsL,
    setAwayStatsL,
  };
};
