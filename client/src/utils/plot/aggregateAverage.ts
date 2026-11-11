import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsBaseData } from "../../pages/Summary/Competition/types";
import { average } from "../math/average";
import { valuesOf } from "./valuesOf";

export const aggregateAverage = <D extends StatsBaseData>(
  data: D[],
  fields: RadarKey[],
): Record<RadarKey, number> => {
  const result = {} as Record<RadarKey, number>;

  for (const field of fields) {
    result[field] = average(valuesOf(data, field));
  }

  return result;
};
