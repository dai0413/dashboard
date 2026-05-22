import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { createConfirmationStep } from "../confirmationStep";
import { teamMatchFormation } from "../models/team-match-formation/forms/l_m";
import { statsL } from "../models/stats-l/forms/l_m";

const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.STATS_L]: [
    ...statsL,
    createConfirmationStep<ModelType.STATS_L>(ModelType.STATS_L),
  ],
  [ModelType.TEAM_MATCH_FORMATION]: [
    ...teamMatchFormation,
    createConfirmationStep<ModelType.TEAM_MATCH_FORMATION>(
      ModelType.TEAM_MATCH_FORMATION,
    ),
  ],
};

const allStep: FormStep<any>[] = [
  ...statsL,
  {
    ...createConfirmationStep<ModelType.STATS_L>(ModelType.STATS_L),
  },
  ...teamMatchFormation,
  {
    ...createConfirmationStep<ModelType.TEAM_MATCH_FORMATION>(
      ModelType.TEAM_MATCH_FORMATION,
    ),
  },
];

export const getL_Msteps = <T extends ModelType>(
  modelType: T,
  all?: boolean,
): FormStep<T>[] => {
  if (all) return allStep as FormStep<T>[];

  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
