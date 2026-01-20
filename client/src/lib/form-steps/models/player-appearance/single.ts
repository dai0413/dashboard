import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const playerAppearance: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    stepLabel: "試合選択",
    type: "form",
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "チーム選択",
    type: "form",
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "選手選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
    type: "form",
    fields: [
      {
        key: "number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
      },

      {
        key: "play_status",
        label: "ステータス",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "position",
        label: "ポジション",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "time",
        label: "プレイ時間",
        fieldType: "input",
        valueType: "number",
      },
    ],
  },
];
