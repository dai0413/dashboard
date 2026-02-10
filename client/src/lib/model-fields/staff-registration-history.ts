import { UIFieldDefinition } from "../../types/field";

export const staffRegistrationHistory: UIFieldDefinition[] = [
  {
    key: "date",
    label: "日付",
    type: "Date",
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
    key: "registration_type",
    label: "登録・抹消",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "changes.role",
    label: "役割",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.role ? `${base}${data.changes.role}` : "";
    },
  },
  {
    key: "changes.name",
    label: "登録名",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.name ? `${base}${data.changes.name}` : "";
    },
  },
  {
    key: "changes.en_name",
    label: "登録名（英語）",
    type: "string",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.en_name ? `${base}${data.changes.en_name}` : "";
    },
  },
  {
    key: "changes.note",
    label: "メモ",
    type: "string",
    filterable: false,
    sortable: false,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.note ? `${base}${data.changes.note}` : "";
    },
  },
];
