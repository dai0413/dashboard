import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.COMPETITION;
const baseModel = ModelType.COMPETITION;

export const single: FormStep<BaseModel>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "大会名",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
      {
        key: "abbr",
        label: "略称",
        fieldType: "input",
        valueType: "text",
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
    stepLabel: "国を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "country",
        label: "国",
        fieldType: "table",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "大会規模・大会タイプ・大会レベル・年代・公式戦",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "competition_type",
        label: "大会規模",
        fieldType: "select",
        valueType: "option",
        required: true,
      },
      {
        key: "category",
        label: "大会タイプ",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "level",
        label: "大会レベル",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "age_group",
        label: "年代",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "official_match",
        label: "公式戦",
        fieldType: "input",
        valueType: "boolean",
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
