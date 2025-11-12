import { FormStep, FormUpdatePair } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { currentTransfer } from "../utils/onChange/currentTransfer";

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
    onChange: async (formData, api) => {
      const { to_team, to_team_name, position } = await currentTransfer(
        formData,
        api
      );

      let obj: FormUpdatePair = [];
      if (to_team_name) {
        obj.push({
          key: "from_team_name",
          value: to_team_name,
        });
      } else if (to_team) {
        obj.push({
          key: "from_team",
          value: to_team,
        });
      }
      if (position) {
        obj.push({
          key: "position",
          value: position,
        });
      }

      return obj;
    },
  },
];
