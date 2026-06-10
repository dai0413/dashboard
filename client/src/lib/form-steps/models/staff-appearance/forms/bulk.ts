import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { bulkBase, getFields } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";

type BaseModel = ModelType.STAFF_APPEARANCE;
const baseModel = ModelType.STAFF_APPEARANCE;

export const bulk: FormStep<BaseModel>[] = [
  {
    stepLabel: "スタッフ出場歴を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match", "team"], { team: { required: false } }),
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
