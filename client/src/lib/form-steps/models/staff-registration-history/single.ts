import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";
import { validateByRegistrationType } from "../../utils/validate/validateByRegistrationType";
import { onChangeFillChangesByRegistrationType } from "./onChange/onChangeFillChangesByRegistrationType";

type BaseModel = ModelType.STAFF_REGISTRATION_HISTORY;
const baseModel = ModelType.STAFF_REGISTRATION_HISTORY;

export const single: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "登録or抹消を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
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
    ],
  },
  {
    stepLabel: "大会シーズン選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "season",
        label: "大会シーズン",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "staff",
        label: "スタッフ",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    onChange: onChangeFillChangesByRegistrationType,
  },
  {
    stepLabel: "役割・名前・英名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "changes.role",
        label: "役割",
        fieldType: "input",
        valueType: "text",
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
        key: "changes.note",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: validateByRegistrationType,
    skip: (data) => {
      return data.registration_type === "deregister";
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
