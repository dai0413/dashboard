import { RadarField, TableData } from "../../components/plot/RadarChart/types";
import { StatsLGet } from "../../types/models/stats-l";
import { buildPlotValues } from "./buildPlotValues";

const groupByToMap = <T, K extends string>(
  data: T[],
  groupBy: (item: T) => K,
): Map<K, T[]> => {
  const result = new Map<K, T[]>();

  for (const item of data) {
    const key = groupBy(item);

    if (!result.has(key)) {
      result.set(key, []);
    }

    result.get(key)!.push(item);
  }

  return result;
};

export const buildTableData = <T extends string>(
  baseData: StatsLGet[],
  plotData: StatsLGet[],
  fields: RadarField[],
  groupBy: (item: StatsLGet) => T,
): TableData => {
  const values = buildPlotValues(baseData, plotData, fields, groupBy);

  const grouped = groupByToMap(plotData, groupBy);

  const actual: TableData["actual"] = [];
  const deviation: TableData["deviation"] = [];
  const rank: TableData["rank"] = [];

  for (const [group, value] of values) {
    const base = grouped.get(group)![0];

    actual.push({
      ...base,
      ...value.actual,
    });

    deviation.push({
      ...base,
      ...value.deviation,
    });

    rank.push({
      ...base,
      ...value.rank,
    });
  }

  return {
    actual,
    deviation,
    rank,
  };
};
