import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";

export const player: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前を入力",
    type: "form",
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
    type: "form",
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
