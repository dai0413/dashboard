import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsBaseData } from "../../pages/Summary/Competition/types";
import { round } from "../math";
import { aggregateAverage } from "./aggregateAverage";
import { aggregateAverageByGroup } from "./aggregateAverageByGroup";
import { aggregateStdDev } from "./aggregateStdDev";
import { calculateDeviation } from "./calculateDeviation";
import { calculateRank } from "./calculateRank";

type PlotValues = {
  value: Partial<
    Record<
      RadarKey,
      {
        actual?: number;
        deviation?: number;
        rank?: number;
      }
    >
  >;
  matchCount: number;
};

export const buildPlotValues = <D extends StatsBaseData, T extends string>(
  baseData: D[],
  plotData: D[],
  fields: RadarField[],
  groupBy: (item: D) => T,
): Map<T, PlotValues> => {
  const keys = fields.map((f) => f.key);

  const baseAverage = aggregateAverage(baseData, keys);
  const baseStdDev = aggregateStdDev(baseData, keys);
  const plotAverages = aggregateAverageByGroup(plotData, keys, groupBy);

  const deviations = calculateDeviation(
    plotAverages,
    baseAverage,
    baseStdDev,
    fields,
  );

  const ranks = calculateRank(baseData, plotData, fields, groupBy);

  const result = new Map<T, PlotValues>();
  const matchCounts = new Map<T, number>();

  for (const item of plotData) {
    const group = groupBy(item);
    matchCounts.set(group, (matchCounts.get(group) ?? 0) + 1);
  }

  for (const [group, actual] of plotAverages) {
    const deviation = deviations.get(group)!;
    const rank = ranks.get(group)!;
    const matchCount = matchCounts.get(group) ?? 0;

    const value: PlotValues["value"] = {};

    for (const field of fields) {
      value[field.key] = {
        actual: round(actual[field.key], 2),
        deviation: round(deviation[field.key], 2),
        rank: rank[field.key],
      };
    }

    result.set(group, {
      value,
      matchCount,
    });
  }

  return result;
};
