import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.STAFF;
const baseModel = ModelType.STAFF;

export const single: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "名前",
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
    modelType: baseModel,
    fields: [
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
