import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.COMPETITION;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  name: {
    key: "name",
    label: "大会名",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  abbr: {
    key: "abbr",
    label: "略称",
    fieldType: "input",
    valueType: "text",
  },
  en_name: {
    key: "en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  country: {
    key: "country",
    label: "国",
    fieldType: "table",
    valueType: "option",
  },
  competition_type: {
    key: "competition_type",
    label: "大会規模",
    fieldType: "select",
    valueType: "option",
    required: true,
  },
  category: {
    key: "category",
    label: "大会タイプ",
    fieldType: "select",
    valueType: "option",
  },
  level: {
    key: "level",
    label: "大会レベル",
    fieldType: "select",
    valueType: "option",
  },
  age_group: {
    key: "age_group",
    label: "年代",
    fieldType: "select",
    valueType: "option",
  },
  official_match: {
    key: "official_match",
    label: "公式戦",
    fieldType: "input",
    valueType: "boolean",
  },
  transferurl: {
    key: "transferurl",
    label: "transferurl",
    fieldType: "input",
    valueType: "text",
  },
  sofaurl: {
    key: "sofaurl",
    label: "sofaurl",
    fieldType: "input",
    valueType: "text",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
