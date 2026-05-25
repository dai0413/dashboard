import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.PLAYER_REGISTRATION;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  season: {
    key: "season",
    label: "大会シーズン",
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
  team: {
    key: "team",
    label: "チーム",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  registration_type: {
    key: "registration_type",
    label: "登録・抹消",
    fieldType: "select",
    valueType: "option",
  },
  date: {
    key: "date",
    label: "日付",
    fieldType: "input",
    valueType: "date",
  },
  number: {
    key: "number",
    label: "背番号",
    fieldType: "input",
    valueType: "number",
  },
  position_group: {
    key: "position_group",
    label: "ポジション",
    fieldType: "select",
    valueType: "option",
  },
  name: {
    key: "name",
    label: "名前",
    fieldType: "input",
    valueType: "text",
  },
  en_name: {
    key: "en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  height: {
    key: "height",
    label: "身長",
    fieldType: "input",
    valueType: "number",
  },
  weight: {
    key: "weight",
    label: "体重",
    fieldType: "input",
    valueType: "number",
  },
  isTypeTwo: {
    key: "isTypeTwo",
    label: "2種登録",
    fieldType: "input",
    valueType: "boolean",
  },
  isSpecialDesignation: {
    key: "isSpecialDesignation",
    label: "特別指定",
    fieldType: "input",
    valueType: "boolean",
  },
  homegrown: {
    key: "homegrown",
    label: "ホームグロウン",
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
