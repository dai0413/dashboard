import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.NATIONAL_MATCH_SERIES;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  name: {
    key: "name",
    label: "活動名",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  country: {
    key: "country",
    label: "国名",
    fieldType: "table",
    valueType: "option",
  },
  age_group: {
    key: "age_group",
    label: "年代・種別",
    fieldType: "select",
    valueType: "option",
  },
  joined_at: {
    key: "joined_at",
    label: "活動開始日",
    fieldType: "input",
    valueType: "date",
  },
  left_at: {
    key: "left_at",
    label: "解散日",
    fieldType: "input",
    valueType: "date",
  },
  urls: {
    key: "urls",
    label: "urls",
    multi: true,
    fieldType: "textarea",
    valueType: "text",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
