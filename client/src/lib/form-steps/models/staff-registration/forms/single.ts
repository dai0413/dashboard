import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { updateName } from "../onChange/updateName";

type BaseModel = ModelType.STAFF_REGISTRATION;
const baseModel = ModelType.STAFF_REGISTRATION;

export const single: FormStep<ModelType.STAFF_REGISTRATION>[] = [
  {
    stepLabel: "大会シーズン選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["staff"]),
    prepareNext: updateName,
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "登録or抹消・日付・役割・名前・英名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "registration_type",
      "date",
      "role",
      "name",
      "en_name",
      "note",
    ]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
