import { FormStep, DataSource, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { onChangeFillChangesByRegistrationType } from "./onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../utils/validate/validateByRegistrationType";

export const bulk: FormStep<ModelType.PLAYER_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: ModelType.PLAYER_REGISTRATION_HISTORY,
    fields: [
      {
        key: "season",
        label: "大会シーズン",
        fieldType: "table",
        valueType: "option",
        dataSource: DataSource.BULK_COMMON,
      },
    ],
  },
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: ModelType.PLAYER_REGISTRATION_HISTORY,
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        dataSource: DataSource.BULK_COMMON,
      },
    ],
  },
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: ModelType.PLAYER_REGISTRATION_HISTORY,
    fields: [
      {
        key: "date",
        label: "日付",
        fieldType: "input",
        valueType: "date",
        dataSource: DataSource.BULK_COMMON,
      },
      {
        key: "registration_type",
        label: "登録・抹消",
        fieldType: "select",
        valueType: "option",
        dataSource: DataSource.BULK_COMMON,
      },
    ],
  },
  {
    stepLabel: "背番号・POS.・名前・英名・身長・体重を入力",
    type: StepType.FORM,
    modelType: ModelType.PLAYER_REGISTRATION_HISTORY,
    fields: [
      {
        key: "season",
        label: "大会シーズン",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "date",
        label: "日付",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "registration_type",
        label: "登録・抹消",
        fieldType: "select",
        valueType: "option",
        required: true,
      },
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "changes.number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "changes.position_group",
        label: "ポジション",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "changes.name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "changes.en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "changes.height",
        label: "身長",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "changes.weight",
        label: "体重",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "changes.isTypeTwo",
        label: "2種登録",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "changes.isSpecialDesignation",
        label: "特別指定",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "changes.homegrown",
        label: "ホームグロウン",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "changes.note",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
      },
    ],
    onChange: onChangeFillChangesByRegistrationType,
    validate: validateByRegistrationType,
    many: true,
  },
];
