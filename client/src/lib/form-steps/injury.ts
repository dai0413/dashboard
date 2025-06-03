import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const injury: FormStep<ModelType.INJURY>[] = [
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        type: "table",
        required: true,
      },
    ],
  },
  {
    stepLabel: "チームを選択",
    type: "form",
    fields: [
      {
        key: "team",
        label: "移籍元",
        type: "table",
      },
    ],
  },
  {
    stepLabel: "日付を入力",
    type: "form",
    fields: [
      { key: "doa", label: "発表日", type: "date", required: true },
      {
        key: "doi",
        label: "負傷日",
        type: "date",
      },
      { key: "dos", label: "手術日", type: "date" },
    ],
  },
  {
    stepLabel: "詳細",
    type: "form",
    fields: [
      {
        key: "injured_part",
        label: "負傷箇所・診断結果",
        type: "multiInput",
      },
      {
        key: "ttp",
        label: "全治期間",
        type: "multiInput",
      },
    ],
  },
];
