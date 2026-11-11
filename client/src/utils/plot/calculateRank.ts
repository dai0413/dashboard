import { RadarField, RadarKey } from "../../components/plot/RadarChart/types";
import { StatsBaseData } from "../../pages/Summary/Competition/types";
import { rank } from "../math/rank";
import { aggregateAverageByGroup } from "./aggregateAverageByGroup";

export const calculateRank = <D extends StatsBaseData, T extends string>(
  baseData: D[],
  plotData: D[],
  fields: RadarField[],
  groupBy: (item: D) => T,
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
