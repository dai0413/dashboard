import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.STAFF_APPEARANCE;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  match: {
    key: "match",
    label: "試合",
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
  },
  staff_name: {
    key: "staff_name",
    label: "登録外スタッフ",
    fieldType: "input",
    valueType: "text",
  },
  role: {
    key: "role",
    label: "役割",
    fieldType: "input",
    valueType: "text",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
