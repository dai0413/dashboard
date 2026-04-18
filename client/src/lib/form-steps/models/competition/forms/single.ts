import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.COMPETITION;
const baseModel = ModelType.COMPETITION;

export const single: FormStep<BaseModel>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "abbr", "en_name"]),
  },
  {
    stepLabel: "国を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["country"]),
  },
  {
    stepLabel: "大会規模・大会タイプ・大会レベル・年代・公式戦",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "competition_type",
      "category",
      "level",
      "age_group",
      "official_match",
    ]),
  },
  {
    stepLabel: "URL",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["transferurl", "sofaurl"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
