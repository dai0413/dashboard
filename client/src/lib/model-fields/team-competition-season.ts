import { UIFieldDefinition } from "../../types/field";

export const teamCompetitionSeason: UIFieldDefinition[] = [
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
