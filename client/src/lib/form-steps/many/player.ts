import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";

export const player: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前・生年月日・出身地を入力",
    type: "form",
    fields: [
      {
        key: "name",
        label: "名前",
        type: "input",
        required: true,
        width: "150px",
      },
      {
        key: "en_name",
        label: "英名",
        type: "input",
        width: "150px",
      },
      {
        key: "dob",
        label: "生年月日",
        type: "date",
        width: "200px",
      },
      {
        key: "pob",
        label: "出身地",
        type: "input",
        width: "100px",
      },
    ],
    many: true,
  },
];
