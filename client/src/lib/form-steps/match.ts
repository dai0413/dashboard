import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const match: FormStep<ModelType.MATCH>[] = [
  {
    stepLabel: "大会ステージを選択",
    type: "form",
    fields: [
      {
        key: "competition_stage",
        label: "大会ステージ",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "チームを選択",
    type: "form",
    fields: [
      {
        key: "home_team",
        label: "ホームチーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "チームを選択",
    type: "form",
    fields: [
      {
        key: "away_team",
        label: "アウェイチーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "スタジアムを選択",
    type: "form",
    fields: [
      {
        key: "stadium",
        label: "スタジアム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "節・試合形式・日付・観客数を入力",
    type: "form",
    fields: [
      {
        key: "match_week",
        label: "節",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "match_format",
        label: "試合形式",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "date",
        label: "日付",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "audience",
        label: "観客数",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "得点",
    type: "form",
    fields: [
      {
        key: "home_goal",
        label: "ホーム得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "away_goal",
        label: "アウェイ得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "home_pk_goal",
        label: "ホームPK得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "away_pk_goal",
        label: "アウェイPK得点",
        fieldType: "input",
        valueType: "number",
      },
    ],
  },
  {
    stepLabel: "気象条件を入力",
    type: "form",
    fields: [
      {
        key: "weather",
        label: "天気",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "temperature",
        label: "気温",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "humidity",
        label: "湿度",
        fieldType: "input",
        valueType: "number",
      },
    ],
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: "form",
    fields: [
      {
        key: "transferurl",
        label: "transferurl",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "sofaurl",
        label: "sofaurl",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "urls",
        label: "urls",
        fieldType: "textarea",
        valueType: "text",
        multh: true,
      },
    ],
  },
];
