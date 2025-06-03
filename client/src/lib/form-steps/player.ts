import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const player: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前",
    type: "form",
    fields: [
      {
        key: "name",
        label: "名前",
        type: "input",
        required: true,
      },
      {
        key: "en_name",
        label: "英名",
        type: "input",
        required: true,
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
        type: "date",
      },
      {
        key: "pob",
        label: "出身地",
        type: "input",
      },
    ],
  },
];
