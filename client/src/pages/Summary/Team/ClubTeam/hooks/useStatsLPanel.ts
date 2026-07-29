import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { StatsL, StatsLGet } from "../../../../../types/models/stats-l";

export const useStatsLPanel = () => {
  const [statsL, setStatsLes] = useState<Data<StatsLGet>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStatsL = async (teamId: string, seasonId?: string) => {
    if (!seasonId) return;
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
        setStatsLes((prev) => ({ ...prev, isLoading: time === "start" }));
      },
    });

    if (obj) {
      let processed = convert(ModelType.STATS_L, obj.data);

      setStatsLes({
        data: processed,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    statsL,
    readStatsL,
  };
};
