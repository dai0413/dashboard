import { RadarKey } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { aggregateAverage } from "./aggregateAverage";

export const aggregateAverageByGroup = <T extends string>(
  data: StatsLGet[],
  fields: RadarKey[],
  groupBy: (item: StatsLGet) => T,
): Map<T, Record<RadarKey, number>> => {
  const groups = new Map<T, StatsLGet[]>();

  // グループ分け
  for (const item of data) {
    const key = groupBy(item);

    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  // 各グループごとに平均を計算
  const result = new Map<T, Record<RadarKey, number>>();

  for (const [key, items] of groups) {
    result.set(key, aggregateAverage(items, fields));
  }

  return result;
};
