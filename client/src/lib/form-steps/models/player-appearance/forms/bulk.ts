import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;

export const bulk: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    stepLabel: "出場状況を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match", "team"]),
  },
  {
    stepLabel: "出場状況を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "match",
      "team",
      "player",
      "player_name",
      "number",
      "play_status",
      "position",
      "time",
    ]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
