import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Data } from "../../../../types/types";
import { createItemBase } from "../../../../lib/api";
import { api } from "../../../../context/api-context";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";

export const usePlayerStatistics = () => {
  const [playerStatistics, setPlayerStatistics] = useState<
    Data<PlayerStatistic>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readPlayerStatistics = async (
    seasonId?: string,
  ): Promise<Data<PlayerStatistic> | null> => {
    if (!seasonId) return null;

    setPlayerStatistics((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const obj = await createItemBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      data: {
        getAll: true,
        season: seasonId,
      },
    });

    if (!obj.success) return null;

    const nextItems = {
      data: obj.data.sort((a, b) => b.minutes - a.minutes),
      totalCount: obj.data.length ? obj.data.length : 0,
      page: 1,
      isLoading: false,
    };

    setPlayerStatistics(nextItems);

    return nextItems;
  };

  return {
    readPlayerStatistics,
    playerStatistics,
    setPlayerStatistics,
  };
};
