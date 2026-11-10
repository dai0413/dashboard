import { Label } from "@dai0413/myorg-shared";
import { RadarField, TableData } from "../../components/plot/RadarChart/types";
import { ModelType } from "../../types/models";
import { StatsL } from "../../types/models/stats-l";
import { buildPlotValues } from "./buildPlotValues";
import { convert } from "../../lib/convert/CreateLabel";

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
  baseData: StatsL[],
  plotData: StatsL[],
  fields: RadarField[],
  groupBy: (item: StatsL) => T,
): TableData => {
  const values = buildPlotValues(baseData, plotData, fields, groupBy);

  const grouped = groupByToMap(plotData, groupBy);

  const actual: TableData["actual"] = [];
  const deviation: TableData["deviation"] = [];
  const rank: TableData["rank"] = [];

  for (const [group, value] of values) {
    const base = grouped.get(group)![0];

    const team: Label = {
      label: convert(ModelType.TEAM, base.team),
      id: base.team._id,
    };

    actual.push({
      ...base,
      ...value.actual,
      team,
      teamColor: base.team.primaryColor,
    });

    deviation.push({
      ...base,
      ...value.deviation,
      team,
      teamColor: base.team.primaryColor,
    });

    rank.push({
      ...base,
      ...value.rank,
      team,
      teamColor: base.team.primaryColor,
    });
  }

  return {
    actual,
    deviation,
    rank,
  };
};
