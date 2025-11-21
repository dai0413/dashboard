import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { setTeam } from "../utils/onChange/transfer/setTeam";
import { teamCheck } from "../utils/validate/teamCheck";

export const transfer: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "共通要素を入力",
    type: "form",
    fields: [
      {
        key: "doa",
        label: "移籍発表日",
        fieldType: "input",
        valueType: "date",
        overwriteByMany: true,
      },
      {
        key: "from_date",
        label: "新チーム加入日",
        fieldType: "input",
        valueType: "date",
        overwriteByMany: true,
      },
      {
        key: "form",
        label: "移籍形態",
        fieldType: "select",
        valueType: "option",
        overwriteByMany: true,
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
        fieldType: "table",
        valueType: "option",
        required: true,
      },
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
      {
        key: "URL",
        label: "URL",
        multi: true,
        fieldType: "textarea",
        valueType: "text",
      },
    ],
    many: true,
    validate: (formData) => {
      const check1 = teamCheck(formData, "from_team", "from_team_name");
      if (!check1.success) return check1;
      return teamCheck(formData, "to_team", "to_team_name");
    },
    onChange: async (formData, api) => {
      const obj = setTeam(formData, api);

      return obj;
    },
  },
];
