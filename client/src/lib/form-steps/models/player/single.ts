import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const player: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前",
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
      },
    ],
  },
  {
    stepLabel: "生年月日・出身地",
    type: "form",
    fields: [
      {
        key: "dob",
        label: "生年月日",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "pob",
        label: "出身地",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
];
