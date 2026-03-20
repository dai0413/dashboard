import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { setMatchTeam } from "../../utils/createFilterConditions/setMatchTeam";

export const teamMatchFormation: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: ModelType.TEAM_MATCH_FORMATION,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: ModelType.TEAM_MATCH_FORMATION,
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "フォーメーションを選択",
    type: StepType.FORM,
    modelType: ModelType.TEAM_MATCH_FORMATION,
    fields: [
      {
        key: "formation",
        label: "フォーメーション",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
];
