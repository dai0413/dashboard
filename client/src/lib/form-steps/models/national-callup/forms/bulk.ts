import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { combineOnChanges } from "../../../utils/onChange/combine";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";
import { getFields } from "../fields";
import { updateDatesFromSeries } from "../onChanges/updateDatesFromSeries";
import { updateDatesFromStatus } from "../onChanges/updateDatesFromStatus";
import { updateTeamFromTransfer } from "../onChanges/updateTeamFromTransfer";
import { teamCheck } from "../validations/teamCheck";

type BaseModel = ModelType.NATIONAL_CALLUP;
const baseModel = ModelType.NATIONAL_CALLUP;

export const bulk: FormStep<ModelType.NATIONAL_CALLUP>[] = [
  {
    stepLabel: "代表試合シリーズを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["series"]),
    dataSource: DataSource.BULK_COMMON,
    onChange: updateDatesFromSeries,
  },
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "position_group",
      "player",
      "team",
      "team_name",
      "number",
      "is_captain",
      "is_overage",
      "is_backup",
      "is_training_partner",
      "is_additional_call",
      "joined_at",
      "left_at",
      "status",
      "left_reason",
    ]),
    many: true,
    validate: (formData) => teamCheck(formData, "team", "team_name"),
    autoFill: toManyOnChange(
      combineOnChanges(updateTeamFromTransfer, updateDatesFromStatus),
    ),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
