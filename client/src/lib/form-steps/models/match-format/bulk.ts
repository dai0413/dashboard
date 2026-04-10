import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.MATCH_FORMAT;
const baseModel = ModelType.MATCH_FORMAT;

export const bulk: FormStep<ModelType.MATCH_FORMAT>[] = [
  {
    stepLabel: "名前を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "ラベル",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "名前・前後半・時間を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "form",
        label: "ラベル",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "start",
        label: "スタート",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "end",
        label: "エンド",
        fieldType: "input",
        valueType: "number",
      },
    ],
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
