import { UIFieldDefinition } from "../../types/field";

export const matchEventType: UIFieldDefinition[] = [
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
    key: "abbr",
    label: "略称",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "event_type",
    label: "イベントタイプ",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
];
