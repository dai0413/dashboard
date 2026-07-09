import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { round } from "../math";
import { aggregateAverage } from "./aggregateAverage";
import { aggregateAverageByGroup } from "./aggregateAverageByGroup";
import { aggregateStdDev } from "./aggregateStdDev";
import { calculateDeviation } from "./calculateDeviation";
import { calculateRank } from "./calculateRank";

type PlotValues = {
  actual: Record<RadarKey, number>;
  deviation: Record<RadarKey, number>;
  rank: Record<RadarKey, number>;
};

export const buildPlotValues = <T extends string>(
  baseData: StatsLGet[],
  plotData: StatsLGet[],
  fields: RadarField[],
  groupBy: (item: StatsLGet) => T,
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

  for (const [group, actual] of plotAverages) {
    const deviation = deviations.get(group)!;
    const rank = ranks.get(group)!;

    const roundedActual = {} as Record<RadarKey, number>;
    const roundedDeviation = {} as Record<RadarKey, number>;

    for (const field of fields) {
      roundedActual[field.key] = round(actual[field.key], 2);
      roundedDeviation[field.key] = round(deviation[field.key], 2);
    }

    result.set(group, {
      actual: roundedActual,
      deviation: roundedDeviation,
      rank,
    });
  }
  return result;
};
