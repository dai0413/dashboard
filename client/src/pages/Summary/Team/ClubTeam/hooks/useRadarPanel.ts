import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { ModelDataMap, ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { StatsL, StatsLGet } from "../../../../../types/models/stats-l";
import { buildRadarPlotData } from "../../../../../utils/plot";
import {
  defFields,
  offFields,
} from "../../../../../components/plot/RadarChart/radarFields";
import { GoalStats } from "../../../Competition/types";
import { getGoalStats } from "../../../../../utils/data/getGoalStats";
import { RadarData } from "../types";

export const useRadarPanel = () => {
  const [radarData, setRadarData] = useState<RadarData>({
    data: {},
    page: 1,
    totalCount: 0,
    isLoading: false,
  });

  const readRadarData = async (
    id: string,
    seasonId?: string,
  ): Promise<RadarData | null> => {
    if (!seasonId) return null;

    // リーグ平均, 標準偏差用データ
    const readBaseData = async (season: string): Promise<StatsLGet[]> => {
      const res = await readItemsBase<StatsL[]>({
        apiInstance: api,
        backendRoute: API_PATHS.STATS_L.ROOT,
        params: {
          getAll: true,
          "match.season": season,
        },
        handleLoading: (time) => {
          setRadarData((prev) => ({ ...prev, isLoading: time === "start" }));
        },
      });

      if (!res?.data) return [];

      const baseDatas = convert(ModelType.STATS_L, res?.data);
      return baseDatas;
    };

    const readMatches = async (seasonId?: string): Promise<GoalStats[]> => {
      if (!seasonId) return [];
      const obj = await readItemsBase<ModelDataMap[ModelType.MATCH][]>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.ROOT,
        params: { getAll: true, season: seasonId },
      });

      if (obj) {
        let processed = convert(ModelType.MATCH, obj.data);
        const data = getGoalStats(processed);
        return data;
      }

      return [];
    };

    const baseData = await readBaseData(seasonId);
    const goalStats = await readMatches(seasonId);

    const goalStatsMap = new Map(
      goalStats.map((g) => [`${g.match.id}_${g.team.id}`, g]),
    );

    const mergedData = baseData.map((d) => {
      const key = `${d.match.id}_${d.team.id}`;
      const stats = goalStatsMap.get(key);

      return {
        ...d,
        goal: stats?.goal,
        against_goal: stats?.against_goal,
      };
    });

    const offRadarData = buildRadarPlotData(
      mergedData,
      mergedData,
      offFields,
      (d) => d.team.id || "",
    ).get(id);

    const defRadarData = buildRadarPlotData(
      mergedData,
      mergedData,
      defFields,
      (d) => d.team.id || "",
    ).get(id);

    if (offRadarData?.matchCount !== defRadarData?.matchCount) return null;

    const newItems: RadarData = {
      data: {
        offRadarData: offRadarData?.values,
        defRadarData: defRadarData?.values,
        matchCounts: offRadarData?.matchCount,
      },
      page: 1,
      totalCount: offRadarData?.matchCount || 0,
      isLoading: false,
    };

    setRadarData(newItems);

    return newItems;
  };

  return {
    radarData,
    readRadarData,
    setRadarData,
  };
};
