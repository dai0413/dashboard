import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";

export const valuesOf = (data: StatsLGet[], field: RadarKey): number[] =>
  data.map((item) => item[field] ?? 0);
