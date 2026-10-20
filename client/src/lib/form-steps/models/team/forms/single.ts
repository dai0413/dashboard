import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { colorCheck } from "../validate/colorCheck";

type BaseModel = ModelType.TEAM;
const baseModel = ModelType.TEAM;

export const single: FormStep<ModelType.TEAM>[] = [
  {
    stepLabel: "チーム名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team", "abbr", "enTeam"]),
  },
  {
    stepLabel: "国名",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["country"]),
  },
  {
    stepLabel: "色",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["primaryColor", "secondaryColor", "tertiaryColor"]),
    validate: (formData) => colorCheck(formData),
  },
  {
    stepLabel: "ジャンル・年代・ディビジョン",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["genre", "age_group", "division", "old_id"]),
  },
  {
    stepLabel: "urlなど",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["jdataid", "labalph", "transferurl", "sofaurl"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
