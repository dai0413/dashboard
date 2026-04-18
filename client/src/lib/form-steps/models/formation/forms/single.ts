import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { validatePositionFormation } from "../validations/position_formation";

type BaseModel = ModelType.FORMATION;
const baseModel = ModelType.FORMATION;

export const single: FormStep<ModelType.FORMATION>[] = [
  {
    stepLabel: "フォーメーション名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name"]),
  },
  {
    stepLabel: "ポジションを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["position_formation"]),
    validate: validatePositionFormation,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
