import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
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
  player: {
    key: "player",
    label: "選手",
    fieldType: "table",
    valueType: "option",
  },
  player_name: {
    key: "player_name",
    label: "登録外選手",
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
  order: {
    key: "order",
    label: "PKなど順番",
    fieldType: "input",
    valueType: "number",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
