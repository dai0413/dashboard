import { ColumnType } from "../../../../types/table";
import { SeasonGet } from "../../../../types/models/season";
import { UIFieldDefinition } from "../../../../types/field";

export const competition: UIFieldDefinition<SeasonGet>[] = [
  {
    key: "competition",
    field: "competition",
    filterKey: "competition.name",
    label: "大会名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "name",
    field: "name",
    label: "シーズン名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "start_date",
    field: "start_date",
    label: "開始日",
    type: "Date",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
  {
    key: "end_date",
    field: "end_date",
    label: "終了日",
    type: "Date",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
  },
];
