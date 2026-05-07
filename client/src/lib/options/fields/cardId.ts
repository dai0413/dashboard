import { UIFieldDefinition } from "../../../types/field";
import { ColumnType } from "../../../types/table";
import { CardIdOption } from "../../../utils/createOption/custom/cardId";

export const cardId: UIFieldDefinition<CardIdOption>[] = [
  {
    key: "season",
    label: "シーズン",
    type: "string",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "season",
  },
  {
    key: "competition",
    label: "大会",
    type: "string",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "competition",
  },
  {
    key: "match_week",
    label: "節",
    type: "string",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "match_week",
    filterable: true,
    sortable: true,
  },
  {
    key: "date",
    label: "日付",
    type: "datetime-local",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "date",
    filterable: true,
    sortable: true,
  },
  {
    key: "home_team",
    label: "ホーム",
    type: "string",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "home_team",
    filterable: true,
    sortable: true,
  },
  {
    key: "away_team",
    label: "アウェイ",
    type: "string",
    displayOnTable: true,
    getValueType: ColumnType.FIELD,
    field: "away_team",
    filterable: true,
    sortable: true,
  },
];
