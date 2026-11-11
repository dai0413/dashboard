import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsBaseData } from "../../pages/Summary/Competition/types";

export const valuesOf = <D extends StatsBaseData>(
  data: D[],
  field: RadarKey,
): number[] => data.map((item) => item[field] ?? 0);
