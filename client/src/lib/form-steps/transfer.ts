import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const transfer: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
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
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "from_team_name",
        label: "移籍元（登録外チーム）",
        fieldType: "input",
        valueType: "text",
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
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "to_team_name",
        label: "移籍先（登録外チーム）",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: (formData) => {
      if (Boolean(formData.from_team) && Boolean(formData.from_team_name)) {
        return {
          success: false,
          message: "移籍元はチームを選択、または入力してください",
        };
      }

      if (Boolean(formData.to_team) && Boolean(formData.to_team_name)) {
        return {
          success: false,
          message: "移籍先はチームを選択、または入力してください",
        };
      }

      const isValid =
        Boolean(formData.from_team) ||
        Boolean(formData.from_team_name) ||
        Boolean(formData.to_team) ||
        Boolean(formData.to_team_name);

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
      {
        key: "doa",
        label: "移籍発表日",
        fieldType: "input",
        valueType: "date",
        required: true,
      },
      {
        key: "from_date",
        label: "新チーム加入日",
        fieldType: "input",
        valueType: "date",
        required: true,
      },
      {
        key: "to_date",
        label: "新チーム満了予定日",
        fieldType: "input",
        valueType: "date",
      },
    ],
  },
  {
    stepLabel: "移籍形態・背番号・ポジションを入力",
    type: "form",
    fields: [
      {
        key: "form",
        label: "移籍形態",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "position",
        label: "ポジション",
        multi: true,
        fieldType: "select",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: "form",
    fields: [
      {
        key: "URL",
        label: "URL",
        multi: true,
        fieldType: "textarea",
        valueType: "text",
      },
    ],
  },
];
