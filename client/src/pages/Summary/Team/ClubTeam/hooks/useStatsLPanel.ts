import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { GettedModelDataMap, ModelType } from "../../../../../types/models";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { StatsL, StatsLGet } from "../../../../../types/models/stats-l";

export const useStatsLPanel = () => {
  const [statsL, setStatsL] = useState<Data<StatsLGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStatsL = async (
    teamId: string,
    seasonId?: string,
  ): Promise<Data<GettedModelDataMap[ModelType.STATS_L]> | null> => {
    if (!seasonId) return null;
    const obj = await readItemsBase<StatsL[]>({
      apiInstance: api,
      backendRoute: API_PATHS.STATS_L.ROOT,
      params: {
        getAll: true,
        team: teamId,
        "match.season": seasonId,
        sort: "match.date",
      },
      handleLoading: (time) => {
        setStatsL((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.STATS_L, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setStatsL(nextItems);

    return nextItems;
  };

  return {
    statsL,
    readStatsL,
    setStatsL,
  };
};
