import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const competitionStage: FormStep<ModelType.COMPETITION_STAGE>[] = [
  {
    stepLabel: "大会を選択",
    type: "form",
    fields: [
      {
        key: "season",
        label: "シーズン",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "ステージデータを編集",
    type: "form",
    fields: [
      {
        key: "stage_type",
        label: "タイプ",
        fieldType: "select",
        valueType: "option",
        required: true,
        width: "150px",
      },
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        width: "200px",
      },
      {
        key: "round_number",
        label: "1=1 回戦, 2=2 回戦",
        fieldType: "input",
        valueType: "number",
        width: "100px",
      },
      {
        key: "leg",
        label: "1=1st, 2=2nd",
        fieldType: "input",
        valueType: "number",
        width: "100px",
      },
      {
        key: "order",
        label: "表示順",
        fieldType: "input",
        valueType: "number",
        width: "100px",
      },
      {
        key: "notes",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
        width: "100px",
      },
    ],
    many: true,
  },
];
