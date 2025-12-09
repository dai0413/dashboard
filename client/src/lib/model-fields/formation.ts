import { UIFieldDefinition } from "../../types/field";

export const formation: UIFieldDefinition[] = [
  {
    key: "name",
    label: "フォーメーション名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "position_formation",
    label: "ポジション",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
];
