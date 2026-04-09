import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { setMatchTeam } from "../../utils/createFilterConditions/setMatchTeam";

export const single: FormStep<ModelType.STAFF_APPEARANCE>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_APPEARANCE,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_APPEARANCE,
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_APPEARANCE,
    fields: [
      {
        key: "staff",
        label: "スタッフ",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "staff_name",
        label: "登録外スタッフ",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: (data) => {
      if (!data.staff && !data.staff_name) {
        return {
          success: false,
          message: "スタッフを選択・または入力してください",
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
    modelType: ModelType.STAFF_APPEARANCE,
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
