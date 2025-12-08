import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const matchEventType: FormStep<ModelType.MATCH_EVENT_TYPE>[] = [
  {
    stepLabel: "大会ステージを選択",
    type: "form",
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
