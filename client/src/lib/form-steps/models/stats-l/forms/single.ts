import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { getFields } from "../fields";
import { createField } from "../utils/createField";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

export const single: FormStep<ModelType.STATS_L>[] = [
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "スタッツを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: createField(),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
