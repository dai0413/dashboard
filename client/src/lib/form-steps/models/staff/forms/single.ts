import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.STAFF;
const baseModel = ModelType.STAFF;

export const single: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name", "dob", "citizenship", "pob"]),
  },
  {
    stepLabel: "選手",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
