import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Data } from "../../../../types/types";
import { createItemBase } from "../../../../lib/api";
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
    const obj = await createItemBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      data: {
        getAll: true,
        player: playerId,
        groupBy: "season",
      },
      handleLoading: (time) => {
        setStatistics((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj.success) {
      setStatistics({
        data: obj.data.sort((a, b) => {
          if (
            a.group?.by === "season" &&
            b.group?.by === "season" &&
            a.group?.data?.start_date &&
            b.group?.data?.start_date
          ) {
            const aDate = a.group?.data?.start_date;
            const bDate = b.group?.data?.start_date;

            return new Date(bDate).getTime() - new Date(aDate).getTime();
          }

          return 0;
        }),
        totalCount: obj.data.length ? obj.data.length : 0,
        page: 1,
        isLoading: false,
      });
    }
  };

  return {
    statistics,
    readStatistics,
  };
};
