import { FieldDefinition } from "../../types/field";

export const teamCompetitionSeason: FieldDefinition[] = [
  {
    key: "team",
    label: "チーム",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "season",
    label: "シーズン",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "competition",
    label: "大会名",
    type: "string",
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
