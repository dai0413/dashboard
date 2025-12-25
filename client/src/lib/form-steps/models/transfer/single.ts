import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { setFromDate } from "./onChange/setFromDate";
import { setTeam } from "./onChange/setTeam";
import { teamCheck } from "./validate/teamCheck";

export const transfer: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "移籍形態・選手を選択",
    type: "form",
    fields: [
      {
        key: "form",
        label: "移籍形態",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    onChange: async (formData, api) => {
      const teamObj = await setTeam(formData, api);

      const from_dateObj = setFromDate(formData);

      return [...teamObj, ...from_dateObj];
    },
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
    skip: (formData) => {
      return formData.form === "更新";
    },
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
    validate: (formData) => teamCheck(formData),
    skip: (formData) => {
      return formData.form === "満了";
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
    stepLabel: "背番号・ポジションを入力",
    type: "form",
    fields: [
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
