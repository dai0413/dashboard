import { UIFieldDefinition } from "../../types/field";

export const playerRegistrationHistory: UIFieldDefinition[] = [
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
    label: "シーズン",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "competition",
    label: "大会",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "player",
    label: "選手",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
  },
  {
    key: "team",
    label: "チーム",
    type: "select",
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
    key: "changes.number",
    label: "背番号",
    type: "number",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.number ? `${base}${data.changes.number}` : "";
    },
  },
  {
    key: "changes.position_group",
    label: "ポジション",
    type: "select",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.position_group
        ? `${base}${data.changes.position_group}`
        : "";
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
    key: "changes.height",
    label: "身長",
    type: "number",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.height ? `${base}${data.changes.height}` : "";
    },
  },
  {
    key: "changes.weight",
    label: "体重",
    type: "number",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.weight ? `${base}${data.changes.weight}` : "";
    },
  },
  {
    key: "changes.homegrown",
    label: "ホームグロウン",
    type: "checkbox",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.homegrown ? `${base}${data.changes.homegrown}` : "";
    },
  },
  {
    key: "changes.isTypeTwo",
    label: "2種登録",
    type: "checkbox",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.isTypeTwo ? `${base}${data.changes.isTypeTwo}` : "";
    },
  },
  {
    key: "changes.isSpecialDesignation",
    label: "特別指定",
    type: "checkbox",
    filterable: true,
    sortable: true,
    displayOnDetail: true,
    getValue: (data) => {
      let base: string = "";
      if (data.registration_type === "変更") {
        base = "変更後→→→";
      }
      return data.changes.isSpecialDesignation
        ? `${base}${data.changes.isSpecialDesignation}`
        : "";
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
