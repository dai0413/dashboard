import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.MATCH_EVENT_TYPE;
const baseModel = ModelType.MATCH_EVENT_TYPE;

export const single: FormStep<ModelType.MATCH_EVENT_TYPE>[] = [
  {
    stepLabel: "大会ステージを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name", "abbr", "event_type"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
