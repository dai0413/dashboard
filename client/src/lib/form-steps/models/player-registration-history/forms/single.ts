import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { playerInSeason } from "../../../utils/createQuickFilterItems/player/playerInSeason";
import { validateByRegistrationType } from "../../../utils/validate/validateByRegistrationType";
import { getFields } from "../fields";
import { onChangeFillChangesByRegistrationType } from "../onChange/onChangeFillChangesByRegistrationType";

type BaseModel = ModelType.PLAYER_REGISTRATION_HISTORY;
const baseModel = ModelType.PLAYER_REGISTRATION_HISTORY;

export const single: FormStep<ModelType.PLAYER_REGISTRATION_HISTORY>[] = [
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
    createQuickFilterItems: (args) => playerInSeason(args.data, args.api),
  },
  {
    stepLabel: "選手選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
    prepareNext: onChangeFillChangesByRegistrationType,
  },
  {
    stepLabel: "背番号・POS.・名前・英名・身長・体重を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
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
    validate: validateByRegistrationType,
    skip: (data) => {
      return data.registration_type === "deregister";
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
