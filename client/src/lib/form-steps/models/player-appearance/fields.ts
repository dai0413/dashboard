import {
  ArrayDataFormStep,
  FormFieldDefinition,
  StepType,
} from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";
import { validatePlayerEitherOne } from "./validations/name";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  match: {
    key: "match",
    label: "試合",
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
  number: {
    key: "number",
    label: "背番号",
    fieldType: "input",
    valueType: "number",
  },
  play_status: {
    key: "play_status",
    label: "ステータス",
    fieldType: "select",
    valueType: "option",
  },
  position: {
    key: "position",
    label: "ポジション",
    fieldType: "select",
    valueType: "option",
  },
  time: {
    key: "time",
    label: "プレイ時間",
    fieldType: "input",
    valueType: "number",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);

export const bulkBase: ArrayDataFormStep<BaseModel> = {
  modelType: baseModel,
  stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
  type: StepType.FORM,
  fields: getFields([
    "match",
    "team",
    "player",
    "player_name",
    "number",
    "play_status",
    "position",
    "time",
  ]),
  many: true,
  validate: validatePlayerEitherOne,
};
