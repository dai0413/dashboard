import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.SEASON;
const baseModel = ModelType.SEASON;

export const single: FormStep<ModelType.SEASON>[] = [
  {
    stepLabel: "大会を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["competition"]),
  },
  {
    stepLabel: "シーズン名・日付",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "start_date", "end_date", "current", "note"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
