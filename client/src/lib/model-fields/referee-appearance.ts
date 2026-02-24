import { UIFieldDefinition } from "../../types/field";

export const refereeAppearance: UIFieldDefinition[] = [
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
    key: "referee",
    filterKey: "referee.name",
    label: "審判",
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
