import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const season: FormStep<ModelType.SEASON>[] = [
  {
    stepLabel: "大会を選択",
    type: "form",
    fields: [
      {
        key: "competition",
        label: "大会",
        type: "table",
        required: true,
      },
    ],
  },
  {
    stepLabel: "シーズン名・日付",
    type: "form",
    fields: [
      {
        key: "name",
        label: "シーズン名(2024 , 2024-2025等)",
        type: "input",
      },
      {
        key: "start_date",
        label: "開始日",
        type: "date",
      },
      {
        key: "end_date",
        label: "終了日",
        type: "date",
      },
      {
        key: "current",
        label: "最新",
        type: "checkbox",
      },
      {
        key: "note",
        label: "メモ",
        type: "input",
      },
    ],
  },
];
