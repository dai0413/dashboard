import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const matchFormat: FormStep<ModelType.MATCH_FORMAT>[] = [
  {
    stepLabel: "フォーマット名",
    type: "form",
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
    type: "form",
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
];
