import { Label } from "@dai0413/myorg-shared";
import { RadarField } from "../../components/plot/RadarChart/types";
import { ModelType } from "../../types/models";
import { buildPlotValues } from "./buildPlotValues";
import { convert } from "../../lib/convert/CreateLabel";
import { StatsActual, StatsValue } from "../../pages/Summary/Competition/types";

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
  baseData: StatsValue[],
  plotData: StatsValue[],
  fields: RadarField[],
  groupBy: (item: StatsValue) => T,
): StatsActual[] => {
  const values = buildPlotValues(baseData, plotData, fields, groupBy);

  const grouped = groupByToMap(plotData, groupBy);

  const actual: StatsActual[] = [];

  for (const [group, value] of values) {
    const base = grouped.get(group)![0];

    const team: Label = {
      label: convert(ModelType.TEAM, base.team),
      id: base.team._id,
    };

    actual.push({
      _id: base._id,
      ...value.value,
      team,
      teamColor: base.team.primaryColor,
    });
  }

  return actual;
};
