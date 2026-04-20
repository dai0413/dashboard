import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.MATCH_FORMAT;
const baseModel = ModelType.MATCH_FORMAT;

export const bulk: FormStep<ModelType.MATCH_FORMAT>[] = [
  {
    stepLabel: "名前を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name"]),
  },
  {
    stepLabel: "名前・前後半・時間を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["period_label", "start", "end", "order"]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
