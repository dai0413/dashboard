import { FieldDefinition } from "../../types/field";

export const player: FieldDefinition[] = [
  {
    key: "name",
    label: "名前",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "en_name",
    label: "英名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "dob",
    label: "生年月日",
    type: "Date",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "pob",
    label: "出身地",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
