import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { rank } from "../math/rank";
import { aggregateAverageByGroup } from "./aggregateAverageByGroup";

export const calculateRank = <T extends string>(
  baseData: StatsLGet[],
  plotData: StatsLGet[],
  fields: RadarField[],
  groupBy: (item: StatsLGet) => T,
): Map<T, Record<RadarKey, number>> => {
  const baseAverages = aggregateAverageByGroup(
    baseData,
    fields.map((f) => f.key),
    groupBy,
  );

  const plotAverages = aggregateAverageByGroup(
    plotData,
    fields.map((f) => f.key),
    groupBy,
  );

  const result = new Map<T, Record<RadarKey, number>>();

  for (const [group, average] of plotAverages) {
    const rankData = {} as Record<RadarKey, number>;

    for (const field of fields) {
      const values = [...baseAverages.values()].map((avg) => avg[field.key]);

      rankData[field.key] = rank(
        values,
        average[field.key],
        field.higherIsBetter,
      );
    }

    result.set(group, rankData);
  }

  return result;
};
