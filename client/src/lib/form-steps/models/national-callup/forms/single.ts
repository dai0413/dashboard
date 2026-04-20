import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { updateDatesFromStatus } from "../onChanges/updateDatesFromStatus";
import { updateTeamFromTransfer } from "../onChanges/updateTeamFromTransfer";
import { leftReasonCheck } from "../validations/leftReasonCheck";
import { teamCheck } from "../validations/teamCheck";

type BaseModel = ModelType.NATIONAL_CALLUP;
const baseModel = ModelType.NATIONAL_CALLUP;

export const single: FormStep<ModelType.NATIONAL_CALLUP>[] = [
  {
    stepLabel: "代表試合シリーズを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["series"]),
  },
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
    onChange: updateTeamFromTransfer,
  },
  {
    stepLabel: "選手のチームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team", "team_name"]),
    validate: (formData) => teamCheck(formData, "team", "team_name"),
  },
  {
    stepLabel: "日付",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["number", "position_group"]),
  },
  {
    stepLabel: "詳細",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "is_captain",
      "is_overage",
      "is_backup",
      "is_training_partner",
      "is_additional_call",
    ]),
  },
  {
    stepLabel: "日付",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["joined_at", "left_at"]),
  },
  {
    stepLabel: "招集状況",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["status", "left_reason"]),
    validate: (formData) => leftReasonCheck(formData),
    onChange: updateDatesFromStatus,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
