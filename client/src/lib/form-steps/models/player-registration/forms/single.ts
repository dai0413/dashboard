import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { combineOnChanges } from "../../../utils/onChange/combine";
import { updateTeam } from "../onChange/updateTeam";
import { updateName } from "../onChange/updateName";

type BaseModel = ModelType.PLAYER_REGISTRATION;
const baseModel = ModelType.PLAYER_REGISTRATION;

export const single: FormStep<ModelType.PLAYER_REGISTRATION>[] = [
  {
    stepLabel: "大会シーズン選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "選手選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
    prepareNext: combineOnChanges(updateName, updateTeam),
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "登録or抹消・日付・背番号・POS.・名前・英名・身長・体重を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "registration_type",
      "date",
      "number",
      "position_group",
      "name",
      "en_name",
      "height",
      "weight",
    ]),
  },
  {
    stepLabel: "2種登録・特別指定・HG・メモを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "isTypeTwo",
      "isSpecialDesignation",
      "homegrown",
      "note",
    ]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
