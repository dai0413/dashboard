import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.REFEREE;
const baseModel = ModelType.REFEREE;

export const single: FormStep<ModelType.REFEREE>[] = [
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
    ],
  },
  {
    stepLabel: "生年月日・出身地・国籍",
    type: StepType.FORM,
    modelType: baseModel,
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
      {
        key: "citizenship",
        label: "国籍",
        fieldType: "select",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "選手DBと紐づけ",
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
  {
    stepLabel: "URL",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "transferurl",
        label: "transferurl",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "sofaurl",
        label: "sofaurl",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
