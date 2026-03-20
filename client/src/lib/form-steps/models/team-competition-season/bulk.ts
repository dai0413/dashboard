import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const teamCompetitionSeason: FormStep<ModelType.TEAM_COMPETITION_SEASON>[] =
  [
    {
      stepLabel: "シーズンを選択",
      type: StepType.FORM,
      modelType: ModelType.TEAM_COMPETITION_SEASON,
      fields: [
        {
          key: "season",
          label: "シーズン",
          fieldType: "table",
          valueType: "option",
        },
      ],
    },
    {
      stepLabel: "チームを選択",
      type: StepType.FORM,
      modelType: ModelType.TEAM_COMPETITION_SEASON,
      fields: [
        {
          key: "team",
          label: "チーム",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
      many: true,
    },
  ];
