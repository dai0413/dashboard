import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsL } from "../../types/models/stats-l";
import { average } from "../math/average";
import { valuesOf } from "./valuesOf";

export const aggregateAverage = (
  data: StatsL[],
  fields: RadarKey[],
): Record<RadarKey, number> => {
  const result = {} as Record<RadarKey, number>;

  for (const field of fields) {
    result[field] = average(valuesOf(data, field));
  }

  return result;
};
