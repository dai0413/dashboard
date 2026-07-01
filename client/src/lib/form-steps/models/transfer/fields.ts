import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  form: {
    key: "form",
    label: "移籍形態",
    fieldType: "select",
    valueType: "option",
  },
  player: {
    key: "player",
    label: "選手",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  from_team: {
    key: "from_team",
    label: "移籍元",
    fieldType: "table",
    valueType: "option",
  },
  from_team_name: {
    key: "from_team_name",
    label: "移籍元（登録外チーム）",
    fieldType: "input",
    valueType: "text",
  },
  to_team: {
    key: "to_team",
    label: "移籍先",
    fieldType: "table",
    valueType: "option",
  },
  to_team_name: {
    key: "to_team_name",
    label: "移籍先（登録外チーム）",
    fieldType: "input",
    valueType: "text",
  },
  doa: {
    key: "doa",
    label: "移籍発表日",
    fieldType: "input",
    valueType: "date",
  },
  from_date: {
    key: "from_date",
    label: "新チーム加入日",
    fieldType: "input",
    valueType: "date",
    required: true,
  },
  to_date: {
    key: "to_date",
    label: "新チーム満了予定日",
    fieldType: "input",
    valueType: "date",
  },
  number: {
    key: "number",
    label: "背番号",
    fieldType: "input",
    valueType: "number",
  },
  position: {
    key: "position",
    label: "ポジション",
    multi: true,
    fieldType: "select",
    valueType: "option",
  },
  URL: {
    key: "URL",
    label: "URL",
    multi: true,
    fieldType: "textarea",
    valueType: "text",
  },
  isCancelled: {
    key: "isCancelled",
    label: "isCancelled",
    fieldType: "input",
    valueType: "boolean",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);
