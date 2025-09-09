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
        type: "table",
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
        type: "input",
        required: true,
      },
      {
        key: "en_name",
        label: "英名",
        type: "input",
      },
      {
        key: "abbr",
        label: "略称",
        type: "input",
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
        type: "input",
      },
      {
        key: "alt_en_names",
        label: "英名",
        type: "input",
      },
      {
        key: "alt_abbrs",
        label: "略称",
        type: "input",
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
        type: "input",
      },
      {
        key: "sofaurl",
        label: "sofa.url",
        type: "input",
      },
    ],
  },
];
