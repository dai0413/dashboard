import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.NATIONAL_CALLUP;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  series: {
    key: "series",
    label: "代表試合シリーズ",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  position_group: {
    key: "position_group",
    label: "POS.",
    fieldType: "select",
    valueType: "option",
    width: "150px",
  },
  player: {
    key: "player",
    label: "選手",
    fieldType: "table",
    valueType: "option",
    required: true,
    width: "200px",
  },
  team: {
    key: "team",
    label: "チーム",
    fieldType: "table",
    valueType: "option",
    width: "150px",
  },
  team_name: {
    key: "team_name",
    label: "チーム名",
    fieldType: "input",
    valueType: "text",
    width: "200px",
  },
  number: {
    key: "number",
    label: "背番号",
    fieldType: "input",
    valueType: "number",
    width: "150px",
  },
  is_captain: {
    key: "is_captain",
    label: "CA.",
    fieldType: "input",
    valueType: "boolean",
    width: "50px",
  },
  is_overage: {
    key: "is_overage",
    label: "OA",
    fieldType: "input",
    valueType: "boolean",
    width: "50px",
  },
  is_backup: {
    key: "is_backup",
    label: "BU.",
    fieldType: "input",
    valueType: "boolean",
    width: "50px",
  },
  is_training_partner: {
    key: "is_training_partner",
    label: "TP.",
    fieldType: "input",
    valueType: "boolean",
    width: "50px",
  },
  is_additional_call: {
    key: "is_additional_call",
    label: "AD.",
    fieldType: "input",
    valueType: "boolean",
    width: "50px",
  },
  joined_at: {
    key: "joined_at",
    label: "活動開始日",
    fieldType: "input",
    valueType: "date",
    width: "170px",
  },
  left_at: {
    key: "left_at",
    label: "解散日",
    fieldType: "input",
    valueType: "date",
    width: "170px",
  },
  status: {
    key: "status",
    label: "招集状況",
    fieldType: "select",
    valueType: "option",
  },
  left_reason: {
    key: "left_reason",
    label: "離脱理由",
    fieldType: "select",
    valueType: "option",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
