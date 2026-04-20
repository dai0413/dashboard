import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.PLAYER;
const baseModel = ModelType.PLAYER;

export const single: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name"]),
  },
  {
    stepLabel: "生年月日・出身地",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["dob", "pob"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
