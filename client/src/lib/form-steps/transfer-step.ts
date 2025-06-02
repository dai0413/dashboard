import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const steps: FormStep<ModelType.TRANSFER>[] = [
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
    stepLabel: "移籍元を選択",
    type: "form",
    fields: [
      {
        key: "from_team",
        label: "移籍元",
        type: "table",
      },
    ],
  },
  {
    stepLabel: "移籍先を選択",
    type: "form",
    fields: [
      {
        key: "to_team",
        label: "移籍先",
        type: "table",
      },
    ],
    validate: (formData) => {
      const hasFrom = Boolean(formData.from_team);
      const hasTo = Boolean(formData.to_team);

      const isValid = hasFrom || hasTo;

      return {
        success: isValid,
        message: isValid ? "" : "移籍元、移籍先少なくとも1つ選択してください",
      };
    },
  },
  {
    stepLabel: "日付を入力",
    type: "form",
    fields: [
      { key: "doa", label: "移籍発表日", type: "date", required: true },
      {
        key: "from_date",
        label: "新チーム加入日",
        type: "date",
        required: true,
      },
      { key: "to_date", label: "新チーム満了予定日", type: "date" },
    ],
  },
  {
    stepLabel: "移籍形態・背番号・ポジションを入力",
    type: "form",
    fields: [
      {
        key: "form",
        label: "移籍形態",
        type: "select",
      },
      { key: "number", label: "背番号", type: "number" },
      {
        key: "position",
        label: "ポジション",
        type: "multiselect",
      },
    ],
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: "form",
    fields: [{ key: "URL", label: "URL", type: "multiurl" }],
  },
];
