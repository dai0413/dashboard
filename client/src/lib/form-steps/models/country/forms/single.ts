import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.COUNTRY;
const baseModel = ModelType.COUNTRY;

export const single: FormStep<ModelType.COUNTRY>[] = [
  {
    stepLabel: "国名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name"]),
  },
  {
    stepLabel: "コードを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["iso3", "fifa_code"]),
  },
  {
    stepLabel: "地域",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "area",
      "district",
      "confederation",
      "sub_confederation",
    ]),
  },
  {
    stepLabel: "協会加入年度",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "established_year",
      "fifa_member_year",
      "association_member_year",
      "district_member_year",
    ]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
