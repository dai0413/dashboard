import { FieldDefinition } from "../../types/field";

export const team: FieldDefinition[] = [
  {
    key: "team",
    label: "チーム名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "abbr",
    label: "略称",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "enTeam",
    label: "英名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "country",
    label: "国名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "genre",
    label: "ジャンル",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "transferurl",
    label: "URL",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
