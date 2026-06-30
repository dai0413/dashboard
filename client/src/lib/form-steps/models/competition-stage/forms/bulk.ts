import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.COMPETITION_STAGE;
const baseModel = ModelType.COMPETITION_STAGE;

export const bulk: FormStep<ModelType.COMPETITION_STAGE>[] = [
  {
    stepLabel: "大会を選択",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "ステージデータを編集",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "season",
      "stage_type",
      "name",
      "round_number",
      "leg",
      "order",
      "notes",
    ]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
