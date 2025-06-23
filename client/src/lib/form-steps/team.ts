import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const team: FormStep<ModelType.TEAM>[] = [
  {
    stepLabel: "チーム情報を入力",
    type: "form",
    fields: [
      {
        key: "team",
        label: "チーム名",
        type: "input",
        required: true,
      },
      {
        key: "abbr",
        label: "略称",
        type: "input",
        required: true,
      },
      {
        key: "pro",
        label: "プロ",
        type: "input",
      },
    ],
  },
];
