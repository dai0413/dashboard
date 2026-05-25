import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.SEASON;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  competition: {
    key: "competition",
    label: "大会",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  name: {
    key: "name",
    label: "シーズン名(2024 , 2024-2025等)",
    fieldType: "input",
    valueType: "text",
  },
  start_date: {
    key: "start_date",
    label: "開始日",
    fieldType: "input",
    valueType: "date",
  },
  end_date: {
    key: "end_date",
    label: "終了日",
    fieldType: "input",
    valueType: "date",
  },
  current: {
    key: "current",
    label: "最新",
    fieldType: "input",
    valueType: "boolean",
  },
  note: {
    key: "note",
    label: "メモ",
    fieldType: "input",
    valueType: "text",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
