import { UIFieldDefinition } from "../../types/field";

export const player: UIFieldDefinition[] = [
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
  {
    key: "old_id",
    label: "旧ID",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
  },
];
