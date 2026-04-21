import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

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
