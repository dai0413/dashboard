import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { buildPlotValues } from "./buildPlotValues";

type Values = Record<
  RadarKey,
  { actual: number; deviation: number; rank: number }
>;

export const buildRadarPlotData = <T extends string>(
  baseData: StatsLGet[],
  plotData: StatsLGet[],
  fields: RadarField[],
  groupBy: (item: StatsLGet) => T,
): Map<T, Values> => {
  const values = buildPlotValues(baseData, plotData, fields, groupBy);

  const result = new Map<T, Values>();

  for (const [group, value] of values) {
    const radar = {} as Values;

    for (const field of fields) {
      radar[field.key] = {
        actual: value.actual[field.key],
        deviation: value.deviation[field.key],
        rank: value.rank[field.key],
      };
    }

    result.set(group, radar);
  }

  return result;
};
