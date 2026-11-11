import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsBaseData } from "../../pages/Summary/Competition/types";
import { standardDeviation } from "../math/standardDeviation";
import { valuesOf } from "./valuesOf";

export const aggregateStdDev = <D extends StatsBaseData>(
  data: D[],
  fields: RadarKey[],
): Record<RadarKey, number> => {
  const result = {} as Record<RadarKey, number>;

  for (const field of fields) {
    result[field] = standardDeviation(valuesOf(data, field));
  }

  return result;
};
