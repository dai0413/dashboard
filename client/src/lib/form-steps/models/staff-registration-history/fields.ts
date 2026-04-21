import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.STAFF_REGISTRATION_HISTORY;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  date: {
    key: "date",
    label: "日付",
    fieldType: "input",
    valueType: "date",
  },
  registration_type: {
    key: "registration_type",
    label: "登録・抹消",
    fieldType: "select",
    valueType: "option",
    required: true,
  },
  season: {
    key: "season",
    label: "大会シーズン",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  team: {
    key: "team",
    label: "チーム",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  staff: {
    key: "staff",
    label: "スタッフ",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  ["changes.role"]: {
    key: "changes.role",
    label: "役割",
    fieldType: "input",
    valueType: "text",
  },
  ["changes.name"]: {
    key: "changes.name",
    label: "名前",
    fieldType: "input",
    valueType: "text",
  },
  ["changes.en_name"]: {
    key: "changes.en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  ["changes.note"]: {
    key: "changes.note",
    label: "メモ",
    fieldType: "input",
    valueType: "text",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
