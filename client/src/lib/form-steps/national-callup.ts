import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const nationalCallUp: FormStep<ModelType.NATIONAL_CALLUP>[] = [
  {
    stepLabel: "代表試合シリーズを選択",
    type: "form",
    fields: [
      {
        key: "series",
        label: "代表試合シリーズ",
        type: "table",
        required: true,
      },
    ],
  },
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        type: "table",
        required: true,
      },
    ],
  },
  {
    stepLabel: "選手のチームを選択",
    type: "form",
    fields: [
      {
        key: "team",
        label: "チーム",
        type: "table",
        required: true,
      },
      {
        key: "team_name",
        label: "チーム名",
        type: "input",
      },
    ],
  },
  {
    stepLabel: "日付",
    type: "form",
    fields: [
      {
        key: "number",
        label: "背番号",
        type: "number",
      },
      {
        key: "position_group",
        label: "ポジション",
        type: "select",
      },
    ],
  },
  {
    stepLabel: "詳細",
    type: "form",
    fields: [
      {
        key: "is_captain",
        label: "キャプテン",
        type: "checkbox",
      },
      {
        key: "is_overage",
        label: "OA",
        type: "checkbox",
      },
      {
        key: "is_backup",
        label: "バックアップ",
        type: "checkbox",
      },
      {
        key: "is_training_partner",
        label: "トレーニングパートナー",
        type: "checkbox",
      },
      {
        key: "is_additional_call",
        label: "追加招集",
        type: "checkbox",
      },
    ],
  },
  {
    stepLabel: "日付",
    type: "form",
    fields: [
      {
        key: "joined_at",
        label: "活動開始日",
        type: "date",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "date",
      },
    ],
  },
  {
    stepLabel: "招集状況",
    type: "form",
    fields: [
      {
        key: "status",
        label: "招集状況",
        type: "select",
      },
      {
        key: "left_reason",
        label: "離脱理由",
        type: "select",
      },
    ],
  },
];
