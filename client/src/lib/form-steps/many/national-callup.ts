import { FormStep, FormUpdatePair } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { currentTransfer } from "../utils/onChange/currentTransfer";

export const nationalCallUp: FormStep<ModelType.NATIONAL_CALLUP>[] = [
  {
    stepLabel: "代表試合シリーズを選択",
    type: "form",
    fields: [
      {
        key: "series",
        label: "代表試合シリーズ",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "position_group",
        label: "POS.",
        fieldType: "select",
        valueType: "option",
        width: "120px",
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
        width: "200px",
      },
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        width: "150px",
      },
      {
        key: "team_name",
        label: "チーム名",
        fieldType: "input",
        valueType: "text",
        width: "200px",
      },
      {
        key: "number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
        width: "100px",
      },
      {
        key: "is_captain",
        label: "CA.",
        fieldType: "input",
        valueType: "boolean",
        width: "50px",
      },
      {
        key: "is_overage",
        label: "OA",
        fieldType: "input",
        valueType: "boolean",
        width: "50px",
      },
      {
        key: "is_backup",
        label: "BU.",
        fieldType: "input",
        valueType: "boolean",
        width: "50px",
      },
      {
        key: "is_training_partner",
        label: "TP.",
        fieldType: "input",
        valueType: "boolean",
        width: "50px",
      },
      {
        key: "is_additional_call",
        label: "AD.",
        fieldType: "input",
        valueType: "boolean",
        width: "50px",
      },
      {
        key: "joined_at",
        label: "活動開始日",
        fieldType: "input",
        valueType: "date",
        width: "170px",
      },
      {
        key: "left_at",
        label: "解散日",
        fieldType: "input",
        valueType: "date",
        width: "170px",
      },
      {
        key: "status",
        label: "招集状況",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "left_reason",
        label: "離脱理由",
        fieldType: "select",
        valueType: "option",
      },
    ],
    many: true,
    validate: (formData) => {
      if (!formData.team && !formData.team_name) {
        return {
          success: false,
          message: "チームを選択、または入力してください",
        };
      }

      if (
        formData.status &&
        formData.status !== "joined" &&
        !formData.left_reason
      ) {
        console.log("error left_reason data", formData);
        return {
          success: false,
          message: "離脱理由を入力してください",
        };
      }

      return {
        success: true,
        message: "",
      };
    },
    onChange: async (formData, api) => {
      const latest = await currentTransfer(formData, api);

      let obj: FormUpdatePair = [];
      if (typeof latest === "string") {
        obj.push({
          key: "team_name",
          value: latest,
        });
      } else if (typeof latest === "object") {
        obj.push({
          key: "team",
          value: latest,
        });
      }

      if (formData.status) {
        if (formData.status === "declined") {
          obj.push({ key: "joined_at", value: undefined });
          obj.push({ key: "left_at", value: undefined });
        } else if (formData.status === "withdrawn") {
          obj.push({ key: "left_at", value: undefined });
        } else if (formData.status === "joined") {
          obj.push({ key: "left_reason", value: undefined });
        }
      }
      return obj;
    },
  },
];
