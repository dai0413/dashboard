import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { StatsL, StatsLGet } from "../../../../../types/models/stats-l";
import { buildRadarPlotData } from "../../../../../utils/plot";
import { TeamGet } from "../../../../../types/models/team";
import {
  defFields,
  offFields,
} from "../../../../../components/plot/RadarChart/radarFields";
import { RadarValues } from "../../../../../utils/plot/buildRadarPlotData";

export const useRadarPanel = () => {
  const [offRadarData, setOffRadarData] = useState<RadarValues | undefined>(
    undefined,
  );
  const [defRadarData, setDefRadarData] = useState<RadarValues | undefined>(
    undefined,
  );
  const [matchCounts, setMatchCounts] = useState<number | undefined>(undefined);
  const [radarDataIsLoading, setRadarDataIsLoading] = useState<boolean>(false);

  const readRadarData = async (
    selected: TeamGet | null,
    id: string,
    seasonId?: string,
  ) => {
    setRadarDataIsLoading(true);

    if (!selected || !seasonId) return setRadarDataIsLoading(false);

    // リーグ平均, 標準偏差用データ
    const readBaseData = async (season: string): Promise<StatsLGet[]> => {
      const res = await readItemsBase<StatsL[]>({
        apiInstance: api,
        backendRoute: API_PATHS.STATS_L.ROOT,
        params: {
          getAll: true,
          "match.season": season,
        },
      });

      if (!res?.data) return [];

      const baseDatas = convert(ModelType.STATS_L, res?.data);
      return baseDatas;
    };

    // リーグ平均, 標準偏差用データ
    const readData = async (season: string): Promise<StatsLGet[]> => {
      const res = await readItemsBase<StatsL[]>({
        apiInstance: api,
        backendRoute: API_PATHS.STATS_L.ROOT,
        params: {
          getAll: true,
          "match.season": season,
        },
      });

      if (!res?.data) return [];

      const baseDatas = convert(ModelType.STATS_L, res?.data);
      return baseDatas;
    };

    const baseData = await readBaseData(seasonId);
    const plotData = await readData(seasonId);

    const offRadarData = buildRadarPlotData(
      baseData,
      plotData,
      offFields,
      (d) => d.team.id || "",
    ).get(id);

    const defRadarData = buildRadarPlotData(
      baseData,
      plotData,
      defFields,
      (d) => d.team.id || "",
    ).get(id);

    setOffRadarData(offRadarData?.values);
    setDefRadarData(defRadarData?.values);

    if (offRadarData?.matchCount !== defRadarData?.matchCount) return;

    setMatchCounts(offRadarData?.matchCount);

    setRadarDataIsLoading(false);
  };

  return {
    offRadarData,
    defRadarData,
    matchCounts,
    radarDataIsLoading,
    readRadarData,
  };
};
