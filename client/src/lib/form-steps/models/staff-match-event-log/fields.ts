import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  match: {
    key: "match",
    label: "試合",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  match_event_type: {
    key: "match_event_type",
    label: "イベントタイプ",
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
  staff: {
    key: "staff",
    label: "スタッフ",
    fieldType: "table",
    valueType: "option",
  },
  staff_name: {
    key: "staff_name",
    label: "登録外スタッフ",
    fieldType: "input",
    valueType: "text",
  },
  time: {
    key: "time",
    label: "試合全体のうちの時間(後半 20 分は 65 と入力)",
    fieldType: "input",
    valueType: "number",
  },
  add_time: {
    key: "add_time",
    label: "追加タイム",
    fieldType: "input",
    valueType: "number",
  },
  special_time: {
    key: "special_time",
    label: "特別時間",
    fieldType: "select",
    valueType: "option",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
