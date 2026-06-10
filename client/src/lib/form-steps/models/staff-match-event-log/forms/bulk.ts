import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { bulkBase, getFields } from "../fields";

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const baseModel = ModelType.STAFF_MATCH_EVENT_LOG;

export const bulk: FormStep<BaseModel>[] = [
  {
    stepLabel: "スタッフイベントログを入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["match", "team"], { team: { required: false } }),
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
