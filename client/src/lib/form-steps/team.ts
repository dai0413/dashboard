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
        type: "input",
        required: true,
      },
      {
        key: "abbr",
        label: "略称",
        type: "input",
      },
      {
        key: "enTeam",
        label: "英名",
        type: "input",
      },
    ],
  },
  {
    stepLabel: "国名・ジャンル",
    type: "form",
    fields: [
      {
        key: "country",
        label: "国名",
        type: "input",
      },
      {
        key: "genre",
        label: "ジャンル",
        type: "select",
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
        type: "number",
      },
      {
        key: "labalph",
        label: "lab.alph",
        type: "input",
      },
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
