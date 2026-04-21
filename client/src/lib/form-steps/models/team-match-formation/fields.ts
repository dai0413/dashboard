import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
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
  formation: {
    key: "formation",
    label: "フォーメーション",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
