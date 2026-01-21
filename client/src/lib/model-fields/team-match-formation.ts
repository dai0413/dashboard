import { UIFieldDefinition } from "../../types/field";

export const teamMatchFormation: UIFieldDefinition[] = [
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
    key: "match",
    filterKey: "match",
    label: "試合",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "formation",
    filterKey: "formation.name",
    label: "フォーメーション名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
