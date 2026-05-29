import {
  FormFieldDefinition,
  FormStep,
  StepType,
} from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";
import { validateStadiumEitherOne } from "./validations/stadium";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  competition_stage: {
    key: "competition_stage",
    label: "大会ステージ",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  home_team: {
    key: "home_team",
    label: "ホームチーム",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  away_team: {
    key: "away_team",
    label: "アウェイチーム",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  stadium: {
    key: "stadium",
    label: "スタジアム",
    fieldType: "table",
    valueType: "option",
  },
  stadium_name: {
    key: "stadium_name",
    label: "登録外スタジアム",
    fieldType: "input",
    valueType: "text",
  },
  match_format: {
    key: "match_format",
    label: "試合形式",
    fieldType: "table",
    valueType: "option",
  },
  match_week: {
    key: "match_week",
    label: "節",
    fieldType: "input",
    valueType: "number",
  },
  date: {
    key: "date",
    label: "日付",
    fieldType: "input",
    valueType: "datetime-local",
  },
  audience: {
    key: "audience",
    label: "観客数",
    fieldType: "input",
    valueType: "text",
  },
  home_goal: {
    key: "home_goal",
    label: "ホーム得点",
    fieldType: "input",
    valueType: "number",
  },
  away_goal: {
    key: "away_goal",
    label: "アウェイ得点",
    fieldType: "input",
    valueType: "number",
  },
  home_pk_goal: {
    key: "home_pk_goal",
    label: "ホームPK得点",
    fieldType: "input",
    valueType: "number",
  },
  away_pk_goal: {
    key: "away_pk_goal",
    label: "アウェイPK得点",
    fieldType: "input",
    valueType: "number",
  },
  weather: {
    key: "weather",
    label: "天気",
    fieldType: "input",
    valueType: "text",
  },
  temperature: {
    key: "temperature",
    label: "気温",
    fieldType: "input",
    valueType: "number",
  },
  humidity: {
    key: "humidity",
    label: "湿度",
    fieldType: "input",
    valueType: "number",
  },
  transferurl: {
    key: "transferurl",
    label: "transferurl",
    fieldType: "input",
    valueType: "text",
  },
  sofaurl: {
    key: "sofaurl",
    label: "sofaurl",
    fieldType: "input",
    valueType: "text",
  },
  urls: {
    key: "urls",
    label: "urls",
    fieldType: "textarea",
    valueType: "text",
    multi: true,
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);

export const bulkBase: FormStep<BaseModel> = {
  modelType: baseModel,
  stepLabel: "取得したデータを編集してください",
  type: StepType.FORM,
  many: true,
  fields: getFields([
    "home_team",
    "away_team",
    "stadium",
    "stadium_name",
    "match_format",
    "match_week",
    "date",
    "audience",
    "home_goal",
    "away_goal",
    "home_pk_goal",
    "away_pk_goal",
    "weather",
    "temperature",
    "humidity",
    "transferurl",
    "sofaurl",
    "urls",
  ]),
  validate: validateStadiumEitherOne,
};
