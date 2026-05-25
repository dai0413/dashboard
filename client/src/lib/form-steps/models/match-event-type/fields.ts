import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.MATCH_EVENT_TYPE;
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
    required: true,
  },
  abbr: {
    key: "abbr",
    label: "略称",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  event_type: {
    key: "event_type",
    label: "イベントタイプ",
    fieldType: "select",
    valueType: "option",
    required: true,
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
