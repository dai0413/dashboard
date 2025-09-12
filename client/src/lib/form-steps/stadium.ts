import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const stadium: FormStep<ModelType.STADIUM>[] = [
  {
    stepLabel: "国を選択",
    type: "form",
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
    type: "form",
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
    type: "form",
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
    type: "form",
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
];
