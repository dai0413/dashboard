import { UIFieldDefinition } from "../../types/field";

export const staffAppearance: UIFieldDefinition[] = [
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
    key: "staff",
    filterKey: "staff.name",
    label: "選手",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
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
    key: "role",
    label: "役割",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
