import { RadarField } from "../../components/plot/RadarChart/types";
import {
  StatsActual,
  StatsBaseData,
} from "../../pages/Summary/Competition/types";
import { buildPlotValues } from "./buildPlotValues";

export const buildRadarPlotData = <D extends StatsBaseData, T extends string>(
  baseData: D[],
  plotData: D[],
  fields: RadarField[],
  groupBy: (item: D) => T,
): Map<T, { values: StatsActual; matchCount: number }> => {
  const values = buildPlotValues(baseData, plotData, fields, groupBy);

  const result = new Map<T, { values: StatsActual; matchCount: number }>();

  for (const [group, value] of values) {
    const radar = {} as StatsActual;

    for (const field of fields) {
      radar[field.key] = {
        ...value.value[field.key],
      };
    }

    result.set(group, {
      values: radar,
      matchCount: value.matchCount,
    });
  }

  return result;
};
