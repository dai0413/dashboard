import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { bulkBase, getFields } from "../fields";

type BaseModel = ModelType.SEASON;
const baseModel = ModelType.SEASON;

export const bulk: FormStep<BaseModel>[] = [
  {
    stepLabel: "大会を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["competition"]),
  },
  {
    ...bulkBase,
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
