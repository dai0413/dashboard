import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.NATIONAL_MATCH_SERIES;
const baseModel = ModelType.NATIONAL_MATCH_SERIES;

export const single: FormStep<ModelType.NATIONAL_MATCH_SERIES>[] = [
  {
    stepLabel: "名称入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name"]),
  },
  {
    stepLabel: "国を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["country"]),
  },
  {
    stepLabel: "年代を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["age_group"]),
  },
  {
    stepLabel: "日付",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["joined_at", "left_at"]),
  },
  {
    stepLabel: "url",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["urls"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
