import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.STAFF;
const baseModel = ModelType.STAFF;

export const bulk: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "名前・生年月日・出身地を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "name",
      "en_name",
      "dob",
      "citizenship",
      "pob",
      "player",
    ]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
