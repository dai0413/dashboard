import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../../lib/api";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import {
  RadarData,
  RadarDataset,
  RadarField,
} from "../../../../../components/plot/RadarChart/types";
import { StatsL, StatsLGet } from "../../../../../types/models/stats-l";
import { buildRadarPlotData } from "../../../../../utils/plot";
import { TeamGet } from "../../../../../types/models/team";
import { radarFields } from "../../../../../components/plot/RadarChart/radarFields";

const guideLine = (
  value: number,
  dataCount: number,
  options?: {
    dash?: number[];
    color?: string;
    width?: number;
  },
): RadarDataset => ({
  label: `${value}`,
  data: Array(dataCount).fill(value),
  borderColor: options?.color ?? "#9ca3af",
  backgroundColor: "transparent",
  borderWidth: options?.width ?? 1,
  borderDash: options?.dash ?? [4, 4],
  pointRadius: 0,
  pointHoverRadius: 0,
  pointHitRadius: 0,
  guide: true,
});

export const useRadarPanel = () => {
  const [offRadarData, setOffRadarData] = useState<RadarData | null>(null);
  const [defRadarData, setDefRadarData] = useState<RadarData | null>(null);
  const [radarDataIsLoading, setRadarDataIsLoading] = useState<boolean>(false);

  const convertToRadarData = (
    teamId: string,
    datasetLabel: string,
    field: RadarField[],
    baseData: StatsLGet[],
    plotData: StatsLGet[],
  ): RadarData | null => {
    const plot = buildRadarPlotData(
      baseData,
      plotData,
      field,
      (d) => d.team.id || "",
    );

    const teamData = plot.get(teamId);

    if (!teamData) return null;

    const labels = field.map((f) => f.label);
    const fieldCountr = field.length;

    const datasets = [
      {
        label: datasetLabel,
        data: field.map((f) => teamData[f.key].deviation),
        tooltipData: field.map((f) => teamData[f.key]),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
      },
      guideLine(40, fieldCountr),
      guideLine(50, fieldCountr, {
        dash: [],
        width: 2,
        color: "#6b7280",
      }),
      guideLine(60, fieldCountr),
    ];

    return { labels, datasets };
  };

  const readRadarData = async (
    selected: TeamGet | null,
    id: string,
    seasonId?: string,
  ) => {
    setRadarDataIsLoading(true);

    if (!selected || !seasonId) return setRadarDataIsLoading(false);

    let teamLabel = [
      selected?.team || selected?.abbr || selected?.enTeam || "",
    ];

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

    teamLabel.push(`${plotData.filter((d) => d.team.id === id).length}試合`);

    const datasetLabel = teamLabel.join(" ");
    const offFields = radarFields.filter(
      (f) => !!f.default && f.category === "attack",
    );
    const defFields = radarFields.filter(
      (f) => !!f.default && f.category === "defense",
    );

    const offRadarData = convertToRadarData(
      id,
      datasetLabel,
      offFields,
      baseData,
      plotData,
    );

    const defRadarData = convertToRadarData(
      id,
      datasetLabel,
      defFields,
      baseData,
      plotData,
    );

    if (offRadarData) {
      setOffRadarData(offRadarData);
    }

    if (defRadarData) {
      setDefRadarData(defRadarData);
    }

    setRadarDataIsLoading(false);
  };

  return {
    offRadarData,
    defRadarData,
    radarDataIsLoading,
    readRadarData,
  };
};
