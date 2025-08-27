import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const referee: FormStep<ModelType.REFEREE>[] = [
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
      },
    ],
  },
  {
    stepLabel: "生年月日・出身地・国籍",
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
      {
        key: "citizenship",
        label: "国籍",
        type: "select",
      },
    ],
  },
  {
    stepLabel: "選手DBと紐づけ",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        type: "table",
      },
    ],
  },
  {
    stepLabel: "URL",
    type: "form",
    fields: [
      {
        key: "transferurl",
        label: "transferurl",
        type: "input",
      },
      {
        key: "sofaurl",
        label: "sofaurl",
        type: "input",
      },
    ],
  },
];
