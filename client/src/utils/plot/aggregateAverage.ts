import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { average } from "../math/average";
import { valuesOf } from "./valuesOf";

export const aggregateAverage = (
  data: StatsLGet[],
  fields: RadarKey[],
): Record<RadarKey, number> => {
  const result = {} as Record<RadarKey, number>;

  for (const field of fields) {
    result[field] = average(valuesOf(data, field));
  }

  return result;
};
