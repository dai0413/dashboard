import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.TEAM_COMPETITION_SEASON;
const baseModel = ModelType.TEAM_COMPETITION_SEASON;

export const bulk: FormStep<ModelType.TEAM_COMPETITION_SEASON>[] = [
  {
    stepLabel: "シーズンを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
