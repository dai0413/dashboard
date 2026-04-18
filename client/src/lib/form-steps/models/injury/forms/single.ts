import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { updateTeam } from "../onChanges/updateTeam";

type BaseModel = ModelType.INJURY;
const baseModel = ModelType.INJURY;

export const single: FormStep<ModelType.INJURY>[] = [
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
    onChange: updateTeam,
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "日付を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["doa", "doi", "dos"]),
  },
  {
    stepLabel: "詳細",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["injured_part", "ttp"]),
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["URL"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
