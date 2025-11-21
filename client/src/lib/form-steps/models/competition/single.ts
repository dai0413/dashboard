import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const competition: FormStep<ModelType.COMPETITION>[] = [
  {
    stepLabel: "名前",
    type: "form",
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
    type: "form",
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
    type: "form",
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
    type: "form",
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
];
