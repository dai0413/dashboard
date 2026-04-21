import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { getFields } from "../fields";
import { updateFormationFromLineup } from "../onChange/updateFormation";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
const baseModel = ModelType.TEAM_MATCH_FORMATION;

export const single: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
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
    onChange: updateFormationFromLineup,
  },
  {
    stepLabel: "フォーメーションを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["formation"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
