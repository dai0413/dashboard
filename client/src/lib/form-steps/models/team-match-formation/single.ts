import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const teamMatchFormation: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    stepLabel: "試合を選択",
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
    stepLabel: "チームを選択",
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
    stepLabel: "フォーメーションを選択",
    type: "form",
    fields: [
      {
        key: "formation",
        label: "フォーメーション",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
];
