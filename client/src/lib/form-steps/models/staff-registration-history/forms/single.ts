import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { validateByRegistrationType } from "../../../utils/validate/validateByRegistrationType";
import { getFields } from "../fields";
import { onChangeFillChangesByRegistrationType } from "../onChange/onChangeFillChangesByRegistrationType";

type BaseModel = ModelType.STAFF_REGISTRATION_HISTORY;
const baseModel = ModelType.STAFF_REGISTRATION_HISTORY;

export const single: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "登録or抹消を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["date", "registration_type"]),
  },
  {
    stepLabel: "大会シーズン選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["staff"]),
    onChange: onChangeFillChangesByRegistrationType,
  },
  {
    stepLabel: "役割・名前・英名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "changes.role",
      "changes.name",
      "changes.en_name",
      "changes.note",
    ]),
    validate: validateByRegistrationType,
    skip: (data) => {
      return data.registration_type === "deregister";
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
