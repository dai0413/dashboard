import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.MATCH_FORMAT;
const baseModel = ModelType.MATCH_FORMAT;

export const single: FormStep<ModelType.MATCH_FORMAT>[] = [
  {
    stepLabel: "フォーマット名",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "フォーマット名",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
    ],
  },
  {
    stepLabel: "ピリオドを入力",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    fields: [
      {
        key: "period_label",
        label: "ラベル",
        fieldType: "select",
        valueType: "option",
        required: true,
      },
      {
        key: "start",
        label: "開始",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "end",
        label: "終了",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "order",
        label: "順番",
        fieldType: "input",
        valueType: "number",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
