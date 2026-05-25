import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.REFEREE_APPEARANCE;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  match: {
    key: "match",
    label: "試合",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  referee: {
    key: "referee",
    label: "審判",
    fieldType: "table",
    valueType: "option",
  },
  referee_name: {
    key: "referee_name",
    label: "登録外審判",
    fieldType: "input",
    valueType: "text",
  },
  role: {
    key: "role",
    label: "役割",
    fieldType: "input",
    valueType: "text",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
