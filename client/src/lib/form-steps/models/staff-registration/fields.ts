import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.STAFF_REGISTRATION;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  season: {
    key: "season",
    label: "大会シーズン",
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
  team: {
    key: "team",
    label: "チーム",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  registration_type: {
    key: "registration_type",
    label: "登録・抹消",
    fieldType: "select",
    valueType: "option",
  },
  date: {
    key: "date",
    label: "日付",
    fieldType: "input",
    valueType: "date",
  },
  role: {
    key: "role",
    label: "役割",
    fieldType: "input",
    valueType: "text",
  },
  name: {
    key: "name",
    label: "名前",
    fieldType: "input",
    valueType: "text",
  },
  en_name: {
    key: "en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  note: {
    key: "note",
    label: "メモ",
    fieldType: "input",
    valueType: "text",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
