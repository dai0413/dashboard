import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.STATS_L;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  team: {
    key: "team",
    label: "チーム名",
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
  enTeam: {
    key: "enTeam",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  country: {
    key: "country",
    label: "国名",
    fieldType: "table",
    valueType: "option",
  },
  genre: {
    key: "genre",
    label: "ジャンル",
    fieldType: "select",
    valueType: "option",
  },
  age_group: {
    key: "age_group",
    label: "年代",
    fieldType: "select",
    valueType: "option",
  },
  division: {
    key: "division",
    label: "ディビジョン",
    fieldType: "select",
    valueType: "option",
  },
  old_id: {
    key: "old_id",
    label: "旧id",
    fieldType: "input",
    valueType: "text",
  },
  jdataid: {
    key: "jdataid",
    label: "j.data.id",
    fieldType: "input",
    valueType: "number",
  },
  labalph: {
    key: "labalph",
    label: "lab.alph",
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
