import { FormStep, DataSource, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";
import { setTeam } from "./onChange/setTeam";
import { teamCheck } from "./validate/teamCheck";

type BaseModel = ModelType.TRANSFER;
const baseModel = ModelType.TRANSFER;

export const bulk: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "doa",
        label: "移籍発表日",
        fieldType: "input",
        valueType: "date",
        dataSource: DataSource.BULK_COMMON,
      },
      {
        key: "from_date",
        label: "新チーム加入日",
        fieldType: "input",
        valueType: "date",
        dataSource: DataSource.BULK_COMMON,
      },
      {
        key: "form",
        label: "移籍形態",
        fieldType: "select",
        valueType: "option",
        dataSource: DataSource.BULK_COMMON,
      },
      {
        key: "URL",
        label: "URL",
        multi: true,
        fieldType: "textarea",
        valueType: "text",
        dataSource: DataSource.BULK_COMMON,
      },
    ],
  },
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
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
    validate: (formData) => teamCheck(formData),
    onChange: async (formData, api) => {
      const obj = setTeam(formData, api);

      return obj;
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
