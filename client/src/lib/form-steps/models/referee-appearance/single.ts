import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const refereeAppearance: FormStep<ModelType.REFEREE_APPEARANCE>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: ModelType.REFEREE_APPEARANCE,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "審判選択",
    type: StepType.FORM,
    modelType: ModelType.REFEREE_APPEARANCE,
    fields: [
      {
        key: "referee",
        label: "審判",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "referee_name",
        label: "登録外審判",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: (data) => {
      if (!data.referee && !data.referee_name) {
        return {
          success: false,
          message: "審判を選択・または入力してください",
        };
      }
      return {
        success: true,
      };
    },
  },
  {
    stepLabel: "役割を入力",
    type: StepType.FORM,
    modelType: ModelType.REFEREE_APPEARANCE,
    fields: [
      {
        key: "role",
        label: "役割",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
];
