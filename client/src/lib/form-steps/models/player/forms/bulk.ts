import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.PLAYER;
const baseModel = ModelType.PLAYER;

export const bulk: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前・生年月日・出身地を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name", "dob", "pob"]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
