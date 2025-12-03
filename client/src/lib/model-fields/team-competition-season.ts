import { UIFieldDefinition } from "../../types/field";

export const teamCompetitionSeason: UIFieldDefinition[] = [
  {
    key: "team",
    filterKey: "team.team",
    label: "チーム",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "season",
    filterKey: "season.name",
    label: "シーズン",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
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
    key: "note",
    label: "メモ",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
