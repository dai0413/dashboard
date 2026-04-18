import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { skipIf } from "../../../utils/skips/skipIf";
import { getFields } from "../fields";

type BaseModel = ModelType.COMPETITION_STAGE;
const baseModel = ModelType.COMPETITION_STAGE;

export const single: FormStep<ModelType.COMPETITION_STAGE>[] = [
  {
    stepLabel: "大会を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "ステージタイプ",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["stage_type"]),
  },
  {
    stepLabel: "ステージ名・ラウンド・レグ・表示順",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "round_number", "leg", "order"]),
    skip: skipIf((v) => v.stage_type === "none"),
  },
  {
    stepLabel: "親要素",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["parent_stage"]),
    skip: skipIf((v) => v.stage_type === "none"),
  },
  {
    stepLabel: "メモ",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["notes"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
