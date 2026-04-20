import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.REFEREE;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
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
  dob: {
    key: "dob",
    label: "生年月日",
    fieldType: "input",
    valueType: "date",
  },
  pob: {
    key: "pob",
    label: "出身地",
    fieldType: "input",
    valueType: "text",
  },
  citizenship: {
    key: "citizenship",
    label: "国籍",
    fieldType: "select",
    valueType: "option",
  },
  player: {
    key: "player",
    label: "選手",
    fieldType: "table",
    valueType: "option",
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
