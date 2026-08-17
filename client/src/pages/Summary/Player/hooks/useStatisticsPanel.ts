import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Data } from "../../../../types/types";
import { readItemsBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

export const useStatisticsPanel = () => {
  const [statistics, setStatistics] = useState<Data<PlayerStatistic>>({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readStatistics = async (playerId: string) => {
    const obj = await readItemsBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      params: {
        getAll: true,
        player: playerId,
      },
      handleLoading: (time) => {
        setStatistics((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      setStatistics({
        data: obj.data,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });
    }
  };

  return {
    statistics,
    readStatistics,
  };
};
