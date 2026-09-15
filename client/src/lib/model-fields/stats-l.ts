import { numberFields } from "@dai0413/myorg-shared";
import { UIFieldDefinition } from "../../types/field";
import { StatsLGet } from "../../types/models/stats-l";
import { ColumnType } from "../../types/table";
import { radarFields } from "../../components/plot/RadarChart/radarFields";

const createField = (key: string): UIFieldDefinition<StatsLGet> => {
  const label = radarFields.find((field) => field.key === key)?.label || key;
  return {
    key,
    field: key as keyof StatsLGet,
    filterKey: key,
    label: label,
    type: "number",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
    displayOnTable: false,
    getValueType: ColumnType.FIELD,
  };
};

const fields = numberFields.map((field) => createField(field));

export const statsL: UIFieldDefinition<StatsLGet>[] = [
  {
    key: "team",
    field: "team",
    filterKey: "team.team",
    label: "チーム",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "match",
    field: "match",
    filterKey: "match",
    label: "試合",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  ...fields,
];
