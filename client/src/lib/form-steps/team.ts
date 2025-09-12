import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const team: FormStep<ModelType.TEAM>[] = [
  {
    stepLabel: "チーム名を入力",
    type: "form",
    fields: [
      {
        key: "team",
        label: "チーム名",
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
        key: "enTeam",
        label: "英名",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "国名",
    type: "form",
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
    stepLabel: "ジャンル・年代・ディビジョン",
    type: "form",
    fields: [
      {
        key: "genre",
        label: "ジャンル",
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
        key: "division",
        label: "ディビジョン",
        fieldType: "select",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "urlなど",
    type: "form",
    fields: [
      {
        key: "jdataid",
        label: "j.data.id",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "labalph",
        label: "lab.alph",
        fieldType: "input",
        valueType: "text",
      },
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
