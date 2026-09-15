import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { buildPlotValues } from "./buildPlotValues";

export type RadarValues = Record<
  RadarKey,
  { actual: number; deviation: number; rank: number }
>;

export const buildRadarPlotData = <T extends string>(
  baseData: StatsLGet[],
  plotData: StatsLGet[],
  fields: RadarField[],
  groupBy: (item: StatsLGet) => T,
): Map<T, { values: RadarValues; matchCount: number }> => {
  const values = buildPlotValues(baseData, plotData, fields, groupBy);

  const result = new Map<T, { values: RadarValues; matchCount: number }>();

  for (const [group, value] of values) {
    const radar = {} as RadarValues;

    for (const field of fields) {
      radar[field.key] = {
        actual: value.actual[field.key],
        deviation: value.deviation[field.key],
        rank: value.rank[field.key],
      };
    }

    result.set(group, {
      values: radar,
      matchCount: value.matchCount,
    });
  }

  return result;
};
