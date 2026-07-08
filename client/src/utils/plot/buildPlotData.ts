import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { round } from "../math";
import { aggregateAverage } from "./aggregateAverage";
import { aggregateAverageByGroup } from "./aggregateAverageByGroup";
import { aggregateStdDev } from "./aggregateStdDev";
import { calculateDeviation } from "./calculateDeviation";
import { calculateRank } from "./calculateRank";

type Values = Record<
  RadarKey,
  { actual: number; deviation: number; rank: number }
>;

export const buildPlotData = <T extends string>(
  baseData: StatsLGet[],
  plotData: StatsLGet[],
  fields: RadarField[],
  groupBy: (item: StatsLGet) => T,
): Map<T, Values> => {
  // ①リーグ平均
  const baseAverage = aggregateAverage(
    baseData,
    fields.map((f) => f.key),
  );

  // ②リーグ標準偏差
  const baseStdDev = aggregateStdDev(
    baseData,
    fields.map((f) => f.key),
  );

  // ③plot対象の平均
  const plotAverages = aggregateAverageByGroup(
    plotData,
    fields.map((f) => f.key),
    groupBy,
  );

  // ④偏差値
  const deviations = calculateDeviation(
    plotAverages,
    baseAverage,
    baseStdDev,
    fields,
  );

  // ⑤順位
  const ranks = calculateRank(baseData, plotData, fields, groupBy);

  const result = new Map<T, Values>();

  for (const [group, average] of plotAverages) {
    const value = {} as Values;

    const deviation = deviations.get(group)!;
    const rank = ranks.get(group)!;

    for (const field of fields) {
      value[field.key] = {
        actual: round(average[field.key], 2),
        deviation: round(deviation[field.key], 2),
        rank: rank[field.key],
      };
    }

    result.set(group, value);
  }

  return result;
};
