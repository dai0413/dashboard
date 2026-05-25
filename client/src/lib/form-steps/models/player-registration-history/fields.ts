import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.PLAYER_REGISTRATION_HISTORY;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  date: {
    key: "date",
    label: "日付",
    fieldType: "input",
    valueType: "date",
  },
  registration_type: {
    key: "registration_type",
    label: "登録・抹消",
    fieldType: "select",
    valueType: "option",
    required: true,
  },
  season: {
    key: "season",
    label: "大会シーズン",
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
    required: true,
  },
  ["changes.number"]: {
    key: "changes.number",
    label: "背番号",
    fieldType: "input",
    valueType: "number",
  },
  ["changes.position_group"]: {
    key: "changes.position_group",
    label: "ポジション",
    fieldType: "select",
    valueType: "option",
  },
  ["changes.name"]: {
    key: "changes.name",
    label: "名前",
    fieldType: "input",
    valueType: "text",
  },
  ["changes.en_name"]: {
    key: "changes.en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  ["changes.height"]: {
    key: "changes.height",
    label: "身長",
    fieldType: "input",
    valueType: "number",
  },
  ["changes.weight"]: {
    key: "changes.weight",
    label: "体重",
    fieldType: "input",
    valueType: "number",
  },
  ["changes.isTypeTwo"]: {
    key: "changes.isTypeTwo",
    label: "2種登録",
    fieldType: "input",
    valueType: "boolean",
  },
  ["changes.isSpecialDesignation"]: {
    key: "changes.isSpecialDesignation",
    label: "特別指定",
    fieldType: "input",
    valueType: "boolean",
  },
  ["changes.homegrown"]: {
    key: "changes.homegrown",
    label: "ホームグロウン",
    fieldType: "input",
    valueType: "boolean",
  },
  ["changes.note"]: {
    key: "changes.note",
    label: "メモ",
    fieldType: "input",
    valueType: "text",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
