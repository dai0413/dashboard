import type { ChartDataset } from "chart.js";

import { StatsLGet } from "../../../types/models/stats-l";

export type RadarKey = keyof Omit<
  StatsLGet,
  "match" | "team" | "updatedAt" | "createdAt" | "_id"
>;

export type RadarCategory = "attack" | "defense" | "";

export type RadarField = {
  key: RadarKey;
  label: string;
  category: RadarCategory;
  higherIsBetter: boolean;
  default: boolean;
};

export type RadarTooltipItem = {
  actual: number; // 実数値
  deviation: number; // 偏差値
  rank: number; // 順位
  unit?: string; // %, 本, 回...
};

export type RadarDataset = ChartDataset<"radar"> & {
  guide?: boolean;
  tooltipData?: RadarTooltipItem[];
};

export type RadarData = Pick<RadarChartProps, "labels" | "datasets">;

export type RadarChartProps = {
  labels: string[];
  datasets: RadarDataset[];
  min?: number;
  max?: number;
  stepSize?: number;
};
