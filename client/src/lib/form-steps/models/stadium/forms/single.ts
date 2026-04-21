import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.STADIUM;
const baseModel = ModelType.STADIUM;

export const single: FormStep<ModelType.STADIUM>[] = [
  {
    stepLabel: "国を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["country"]),
  },
  {
    stepLabel: "名称",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name", "abbr"]),
  },
  {
    stepLabel: "別名",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["alt_names", "alt_en_names", "alt_abbrs"]),
  },
  {
    stepLabel: "urlなど",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["transferurl", "sofaurl"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
