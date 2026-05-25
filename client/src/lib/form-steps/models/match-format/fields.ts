import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.MATCH_FORMAT;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  name: {
    key: "name",
    label: "フォーマット名",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  period_label: {
    key: "period_label",
    label: "ラベル",
    fieldType: "select",
    valueType: "option",
    required: true,
  },
  start: {
    key: "start",
    label: "開始",
    fieldType: "input",
    valueType: "number",
  },
  end: {
    key: "end",
    label: "終了",
    fieldType: "input",
    valueType: "number",
  },
  order: {
    key: "order",
    label: "順番",
    fieldType: "input",
    valueType: "number",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
