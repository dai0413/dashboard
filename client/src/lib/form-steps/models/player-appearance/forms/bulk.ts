import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { bulkBase, getFields } from "../fields";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;

export const bulk: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    many: false,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match", "team"]),
  },
  ...bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
