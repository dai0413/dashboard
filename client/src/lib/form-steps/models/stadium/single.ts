import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.STADIUM;
const baseModel = ModelType.STADIUM;

export const single: FormStep<ModelType.STADIUM>[] = [
  {
    stepLabel: "国を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "country",
        label: "国",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "名称",
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
        key: "abbr",
        label: "略称",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "別名",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "alt_names",
        label: "名前",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "alt_en_names",
        label: "英名",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "alt_abbrs",
        label: "略称",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "urlなど",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "transferurl",
        label: "transfer.url",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "sofaurl",
        label: "sofa.url",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
