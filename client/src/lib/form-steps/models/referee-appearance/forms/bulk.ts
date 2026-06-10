import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { bulkBase, getFields } from "../fields";

type BaseModel = ModelType.REFEREE_APPEARANCE;
const baseModel = ModelType.REFEREE_APPEARANCE;

export const bulk: FormStep<ModelType.REFEREE_APPEARANCE>[] = [
  {
    stepLabel: "出場状況を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match", "team"]),
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
