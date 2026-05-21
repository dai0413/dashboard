import { FormStep, DataSource, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { onChangeFillChangesByRegistrationType } from "../onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../../utils/validate/validateByRegistrationType";
import { getFields } from "../fields";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";

type BaseModel = ModelType.PLAYER_REGISTRATION_HISTORY;
const baseModel = ModelType.PLAYER_REGISTRATION_HISTORY;

export const bulk: FormStep<ModelType.PLAYER_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
    dataSource: DataSource.BULK_COMMON,
  },
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
    dataSource: DataSource.BULK_COMMON,
  },
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["date", "registration_type"]),
    dataSource: DataSource.BULK_COMMON,
  },
  {
    stepLabel: "背番号・POS.・名前・英名・身長・体重を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "season",
      "date",
      "registration_type",
      "team",
      "player",
      "changes.number",
      "changes.position_group",
      "changes.name",
      "changes.en_name",
      "changes.height",
      "changes.weight",
      "changes.isTypeTwo",
      "changes.isSpecialDesignation",
      "changes.homegrown",
      "changes.note",
    ]),
    onChange: toManyOnChange(onChangeFillChangesByRegistrationType),
    validate: validateByRegistrationType,
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
