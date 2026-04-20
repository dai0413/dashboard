import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.REFEREE;
const baseModel = ModelType.REFEREE;

export const single: FormStep<ModelType.REFEREE>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name"]),
  },
  {
    stepLabel: "生年月日・出身地・国籍",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["dob", "pob", "citizenship"]),
  },
  {
    stepLabel: "選手DBと紐づけ",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
  },
  {
    stepLabel: "URL",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["transferurl", "sofaurl"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
