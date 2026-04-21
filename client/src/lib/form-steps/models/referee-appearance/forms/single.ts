import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { validateRefereeEitherOne } from "../validations/referee";

type BaseModel = ModelType.REFEREE_APPEARANCE;
const baseModel = ModelType.REFEREE_APPEARANCE;

export const single: FormStep<ModelType.REFEREE_APPEARANCE>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
  },
  {
    stepLabel: "審判選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["referee", "referee_name"]),
    validate: validateRefereeEitherOne,
  },
  {
    stepLabel: "役割を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["role"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
