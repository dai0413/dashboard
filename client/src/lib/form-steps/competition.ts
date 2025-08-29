import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const competition: FormStep<ModelType.COMPETITION>[] = [
  {
    stepLabel: "名前",
    type: "form",
    fields: [
      {
        key: "name",
        label: "大会名",
        type: "input",
        required: true,
      },
      {
        key: "abbr",
        label: "略称",
        type: "input",
      },
      {
        key: "en_name",
        label: "英名",
        type: "input",
      },
    ],
  },
  {
    stepLabel: "国・大会規模・大会タイプ・大会レベル・年代・公式戦",
    type: "form",
    fields: [
      {
        key: "country",
        label: "国",
        type: "select",
      },
      {
        key: "competition_type",
        label: "大会規模",
        type: "select",
        required: true,
      },
      {
        key: "category",
        label: "大会タイプ",
        type: "select",
      },
      {
        key: "level",
        label: "大会レベル",
        type: "select",
      },
      {
        key: "age_group",
        label: "年代",
        type: "select",
      },
      {
        key: "official_match",
        label: "公式戦",
        type: "checkbox",
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
