import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const bulk: FormStep<ModelType.MATCH_EVENT_TYPE>[] = [
  {
    stepLabel: "大会ステージを選択",
    type: StepType.FORM,
    modelType: ModelType.MATCH_EVENT_TYPE,
    many: true,
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
];
