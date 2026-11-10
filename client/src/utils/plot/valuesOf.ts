import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsL } from "../../types/models/stats-l";

export const valuesOf = (data: StatsL[], field: RadarKey): number[] =>
  data.map((item) => item[field] ?? 0);
