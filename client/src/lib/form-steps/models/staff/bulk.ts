import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const staff: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "名前・生年月日・出身地を入力",
    type: "form",
    fields: [
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        required: true,
        width: "150px",
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
        width: "150px",
      },
      {
        key: "dob",
        label: "生年月日",
        fieldType: "input",
        valueType: "date",
        width: "200px",
      },
      {
        key: "citizenship",
        label: "国籍",
        fieldType: "table",
        valueType: "option",
        multi: true,
      },
      {
        key: "pob",
        label: "出身地",
        fieldType: "input",
        valueType: "text",
        width: "100px",
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
      },
    ],
    many: true,
  },
];
