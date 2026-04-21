import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.STADIUM;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  country: {
    key: "country",
    label: "国",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  name: {
    key: "name",
    label: "名前",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  en_name: {
    key: "en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  abbr: {
    key: "abbr",
    label: "略称",
    fieldType: "input",
    valueType: "text",
  },
  alt_names: {
    key: "alt_names",
    label: "名前",
    fieldType: "input",
    valueType: "text",
  },
  alt_en_names: {
    key: "alt_en_names",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  alt_abbrs: {
    key: "alt_abbrs",
    label: "略称",
    fieldType: "input",
    valueType: "text",
  },
  transferurl: {
    key: "transferurl",
    label: "transfer.url",
    fieldType: "input",
    valueType: "text",
  },
  sofaurl: {
    key: "sofaurl",
    label: "sofa.url",
    fieldType: "input",
    valueType: "text",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
