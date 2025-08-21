import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { NationalCallupForm } from "../../../types/models/national-callup";

export const nationalCallUp: FormStep<ModelType.NATIONAL_CALLUP>[] = [
  {
    stepLabel: "代表試合シリーズを選択",
    type: "form",
    fields: [
      {
        key: "series",
        label: "代表試合シリーズ",
        type: "table",
        required: true,
      },
    ],
  },
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        type: "table",
        required: true,
        width: "200px",
      },
      {
        key: "team",
        label: "チーム",
        type: "table",
        width: "150px",
      },
      {
        key: "team_name",
        label: "チーム名",
        type: "input",
        width: "200px",
      },
      {
        key: "number",
        label: "背番号",
        type: "number",
        width: "100px",
      },
      {
        key: "position_group",
        label: "POS.",
        type: "select",
        width: "120px",
      },
      {
        key: "is_captain",
        label: "CA.",
        type: "checkbox",
        width: "50px",
      },
      {
        key: "is_overage",
        label: "OA",
        type: "checkbox",
        width: "50px",
      },
      {
        key: "is_backup",
        label: "BU.",
        type: "checkbox",
        width: "50px",
      },
      {
        key: "is_training_partner",
        label: "TP.",
        type: "checkbox",
        width: "50px",
      },
      {
        key: "is_additional_call",
        label: "AD.",
        type: "checkbox",
        width: "50px",
      },
      {
        key: "joined_at",
        label: "活動開始日",
        type: "date",
        width: "170px",
      },
      {
        key: "left_at",
        label: "解散日",
        type: "date",
        width: "170px",
      },
      {
        key: "status",
        label: "招集状況",
        type: "select",
      },
      {
        key: "left_reason",
        label: "離脱理由",
        type: "select",
      },
    ],
    many: true,
    validate: (formData: NationalCallupForm) => {
      if (Boolean(formData.team) && Boolean(formData.team_name)) {
        return {
          success: false,
          message: "チームを選択、または入力してください",
        };
      }

      const isValid = Boolean(formData.team) || Boolean(formData.team_name);

      return {
        success: isValid,
        message: isValid ? "" : "移籍元、移籍先少なくとも1つ選択してください",
      };
    },
  },
];
