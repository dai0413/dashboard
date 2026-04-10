import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.TEAM_COMPETITION_SEASON;
const baseModel = ModelType.TEAM_COMPETITION_SEASON;

export const single: FormStep<ModelType.TEAM_COMPETITION_SEASON>[] = [
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
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
    stepLabel: "シーズンを選択",
    type: StepType.FORM,
    modelType: baseModel,
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
    stepLabel: "メモを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "note",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
