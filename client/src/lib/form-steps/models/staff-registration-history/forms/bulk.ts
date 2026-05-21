import { FormStep, DataSource, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { onChangeFillChangesByRegistrationType } from "../onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../../utils/validate/validateByRegistrationType";
import { getFields } from "../fields";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";

type BaseModel = ModelType.STAFF_REGISTRATION_HISTORY;
const baseModel = ModelType.STAFF_REGISTRATION_HISTORY;

export const bulk: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["date", "registration_type"]),
  },
  {
    stepLabel: "役割・名前・英名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "season",
      "date",
      "registration_type",
      "team",
      "staff",
      "changes.role",
      "changes.name",
      "changes.en_name",
      "changes.note",
    ]),
    onChange: toManyOnChange(onChangeFillChangesByRegistrationType),
    validate: validateByRegistrationType,
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
