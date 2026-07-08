import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { standardDeviation } from "../math/standardDeviation";
import { valuesOf } from "./valuesOf";

export const aggregateStdDev = (
  data: StatsLGet[],
  fields: RadarKey[],
): Record<RadarKey, number> => {
  const result = {} as Record<RadarKey, number>;

  for (const field of fields) {
    result[field] = standardDeviation(valuesOf(data, field));
  }

  return result;
};
