import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Data } from "../../../../types/types";
import { createItemBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

export const usePlayerStatistics = () => {
  const [playerStatistics, setPlayerStatistics] = useState<
    Data<PlayerStatistic>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readPlayerStatistics = async (seasonId?: string) => {
    if (!seasonId) return;
    setPlayerStatistics((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const statisticsObj = await createItemBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      data: {
        getAll: true,
        season: seasonId,
      },
    });

    if (statisticsObj.success) {
      setPlayerStatistics({
        data: statisticsObj.data.sort((a, b) => b.minutes - a.minutes),
        totalCount: statisticsObj.data.length ? statisticsObj.data.length : 0,
        page: 1,
        isLoading: false,
      });
    }
  };

  return {
    readPlayerStatistics,
    playerStatistics,
  };
};
