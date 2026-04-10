import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.NATIONAL_MATCH_SERIES;
const baseModel = ModelType.NATIONAL_MATCH_SERIES;

export const single: FormStep<ModelType.NATIONAL_MATCH_SERIES>[] = [
  {
    stepLabel: "名称入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "活動名",
        fieldType: "input",
        valueType: "text",
        required: true,
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
        label: "国名",
        fieldType: "table",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "年代を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "age_group",
        label: "年代・種別",
        fieldType: "select",
        valueType: "option",
      },
    ],
  },
  // {
  //   stepLabel: "試合を選択",
  //   type: StepType.FORM,
  //   modelType: baseModel,
  //   fields: [
  //     {
  //       key: "matchs",
  //       label: "試合",
  //       fieldType : "table",valueType : "option",
  //     },
  //   ],
  // },
  {
    stepLabel: "日付",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "joined_at",
        label: "活動開始日",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "left_at",
        label: "解散日",
        fieldType: "input",
        valueType: "date",
      },
    ],
  },
  {
    stepLabel: "url",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "urls",
        label: "urls",
        multi: true,
        fieldType: "textarea",
        valueType: "text",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
