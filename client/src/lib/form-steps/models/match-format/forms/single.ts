import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.MATCH_FORMAT;
const baseModel = ModelType.MATCH_FORMAT;

export const single: FormStep<ModelType.MATCH_FORMAT>[] = [
  {
    stepLabel: "フォーマット名",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name"]),
  },
  {
    stepLabel: "ピリオドを入力",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    fields: getFields(["period_label", "start", "end", "order"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
