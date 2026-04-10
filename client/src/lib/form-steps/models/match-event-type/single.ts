import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.MATCH_EVENT_TYPE;
const baseModel = ModelType.MATCH_EVENT_TYPE;

export const single: FormStep<ModelType.MATCH_EVENT_TYPE>[] = [
  {
    stepLabel: "大会ステージを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
      {
        key: "abbr",
        label: "略称",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
      {
        key: "event_type",
        label: "イベントタイプ",
        fieldType: "select",
        valueType: "option",
        required: true,
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
