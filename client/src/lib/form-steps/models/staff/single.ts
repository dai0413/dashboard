import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const staff: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: ModelType.STAFF,
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
      {
        key: "dob",
        label: "生年月日",
        fieldType: "input",
        valueType: "date",
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
      },
    ],
  },
  {
    stepLabel: "選手",
    type: StepType.FORM,
    modelType: ModelType.STAFF,
    fields: [
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
      },
    ],
  },
];
