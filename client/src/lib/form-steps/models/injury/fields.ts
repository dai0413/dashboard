import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.INJURY;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  player: {
    key: "player",
    label: "選手",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  team: {
    key: "team",
    label: "所属",
    fieldType: "table",
    valueType: "option",
  },
  doa: {
    key: "doa",
    label: "発表日",
    fieldType: "input",
    valueType: "date",
    required: true,
  },
  doi: {
    key: "doi",
    label: "負傷日",
    fieldType: "input",
    valueType: "date",
  },
  dos: { key: "dos", label: "手術日", fieldType: "input", valueType: "date" },
  injured_part: {
    key: "injured_part",
    label: "負傷箇所・診断結果",
    fieldType: "input",
    valueType: "text",
    multi: true,
  },
  ttp: {
    key: "ttp",
    label: "全治期間",
    fieldType: "input",
    valueType: "text",
    multi: true,
  },
  URL: {
    key: "URL",
    label: "URL",
    fieldType: "textarea",
    valueType: "text",
    multi: true,
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
