import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const bulk: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前を入力",
    type: StepType.FORM,
    modelType: ModelType.PLAYER,
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
    modelType: ModelType.PLAYER,
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
];
