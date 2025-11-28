import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const competitionStage: FormStep<ModelType.COMPETITION_STAGE>[] = [
  {
    stepLabel: "大会を選択",
    type: "form",
    fields: [
      {
        key: "season",
        label: "シーズン",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "ステージタイプ",
    type: "form",
    fields: [
      {
        key: "stage_type",
        label: "ステージタイプを選択",
        fieldType: "select",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "ステージ名・ラウンド・レグ・表示順",
    type: "form",
    fields: [
      {
        key: "name",
        label: "名前を入力  （準決勝, 決勝, グループステージ A)",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "round_number",
        label: "ラウンド (1=1 回戦, 2=2 回戦)",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "leg",
        label: "2試合合計制など (1=1st, 2=2nd)",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "order",
        label: "並び順",
        fieldType: "input",
        valueType: "number",
      },
    ],
    skip: (values) => {
      if ("stage_type" in values) {
        return values.stage_type === "none";
      }

      return false;
    },
  },
  {
    stepLabel: "親要素",
    type: "form",
    fields: [
      {
        key: "parent_stage",
        label: "親要素",
        fieldType: "select",
        valueType: "option",
      },
    ],
    skip: (values) => {
      if ("stage_type" in values) {
        return values.stage_type === "none";
      }

      return false;
    },
  },
  {
    stepLabel: "メモ",
    type: "form",
    fields: [
      {
        key: "notes",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
];
