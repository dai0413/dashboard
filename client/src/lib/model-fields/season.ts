import { UIFieldDefinition } from "../../types/field";

export const season: UIFieldDefinition[] = [
  {
    key: "competition",
    filterKey: "competition.name",
    label: "大会名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "name",
    label: "名前",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "start_date",
    label: "開始日",
    type: "Date",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "end_date",
    label: "終了日",
    type: "Date",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "current",
    label: "現在シーズン",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "note",
    label: "メモ",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
