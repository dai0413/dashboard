import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";
import { setDate } from "./utils/onChange/national-callup/setDate";
import { setTeam } from "./utils/onChange/national-callup/setTeam";
import { leftReasonCheck } from "./utils/validate/national-callup/leftReasonCheck";
import { teamCheck } from "./utils/validate/teamCheck";

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
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    onChange: async (formData, api) => {
      const obj = await setTeam(formData, api);

      return obj;
    },
  },
  {
    stepLabel: "選手のチームを選択",
    type: "form",
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "team_name",
        label: "チーム名",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: (formData) => teamCheck(formData, "team", "team_name"),
  },
  {
    stepLabel: "日付",
    type: "form",
    fields: [
      {
        key: "number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "position_group",
        label: "ポジション",
        fieldType: "select",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "詳細",
    type: "form",
    fields: [
      {
        key: "is_captain",
        label: "キャプテン",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "is_overage",
        label: "OA",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "is_backup",
        label: "バックアップ",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "is_training_partner",
        label: "トレーニングパートナー",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "is_additional_call",
        label: "追加招集",
        fieldType: "input",
        valueType: "boolean",
      },
    ],
  },
  {
    stepLabel: "日付",
    type: "form",
    fields: [
      {
        key: "joined_at",
        label: "活動開始日",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "left_at",
        label: "解散日",
        fieldType: "input",
        valueType: "date",
      },
    ],
  },
  {
    stepLabel: "招集状況",
    type: "form",
    fields: [
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
    validate: (formData) => leftReasonCheck(formData),
    onChange: async (formData, _api) => {
      const obj = setDate(formData);
      return obj;
    },
  },
];
