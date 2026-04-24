import { UIFieldDefinition } from "../../types/field";
import { StaffRegistrationHistoryGet } from "../../types/models/staff-registration-history";
import { ColumnType } from "../../types/table";

export const staffRegistrationHistory: UIFieldDefinition<StaffRegistrationHistoryGet>[] =
  [
    {
      key: "date",
      field: "date",
      label: "日付",
      type: "Date",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "season",
      field: "season",
      filterKey: "season.name",
      label: "シーズン",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "competition",
      field: "competition",
      filterKey: "competition.name",
      label: "大会名",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "staff",
      field: "staff",
      filterKey: "staff.name",
      label: "選手",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "team",
      field: "team",
      filterKey: "team.team",
      label: "チーム",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "registration_type",
      field: "registration_type",
      label: "登録・抹消",
      type: "select",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.FIELD,
    },
    {
      key: "changes.role",
      label: "役割",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.CUSTOM,
      getData: (data) => {
        let base: string = "";
        if (data.registration_type === "変更") {
          base = "変更後→→→";
        }
        return data.changes?.role ? `${base}${data.changes?.role}` : "";
      },
    },
    {
      key: "changes.name",
      label: "登録名",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.CUSTOM,
      getData: (data) => {
        let base: string = "";
        if (data.registration_type === "変更") {
          base = "変更後→→→";
        }
        return data.changes?.name ? `${base}${data.changes?.name}` : "";
      },
    },
    {
      key: "changes.en_name",
      label: "登録名（英語）",
      type: "string",
      filterable: true,
      sortable: true,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.CUSTOM,
      getData: (data) => {
        let base: string = "";
        if (data.registration_type === "変更") {
          base = "変更後→→→";
        }
        return data.changes?.en_name ? `${base}${data.changes?.en_name}` : "";
      },
    },
    {
      key: "changes.note",
      label: "メモ",
      type: "string",
      filterable: false,
      sortable: false,
      displayOnDetail: true,
      displayOnTable: true,
      getValueType: ColumnType.CUSTOM,
      getData: (data) => {
        let base: string = "";
        if (data.registration_type === "変更") {
          base = "変更後→→→";
        }
        return data.changes?.note ? `${base}${data.changes?.note}` : "";
      },
    },
  ];
