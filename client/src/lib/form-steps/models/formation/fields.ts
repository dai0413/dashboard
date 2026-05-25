import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.FORMATION;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  name: {
    key: "name",
    label: "フォーメーション名",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  position_formation: {
    key: "position_formation",
    label: "ポジション",
    fieldType: "select",
    valueType: "option",
    multi: true,
    uniqueInArray: true,
    lengthInArray: 11,
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
