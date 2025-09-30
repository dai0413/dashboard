import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { createConfirmationStep } from "../confirmationStep";
import { player } from "./player";
import { nationalCallUp } from "./national-callup";
import { teamCompetitionSeason } from "./team-competition-season";
import { competitionStage } from "./competition-stage";

const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.COMPETITION_STAGE]: [
    ...competitionStage,
    createConfirmationStep<ModelType.COMPETITION_STAGE>(),
  ],
  [ModelType.PLAYER]: [...player, createConfirmationStep<ModelType.PLAYER>()],
  [ModelType.NATIONAL_CALLUP]: [
    ...nationalCallUp,
    createConfirmationStep<ModelType.NATIONAL_CALLUP>(),
  ],
  [ModelType.TEAM_COMPETITION_SEASON]: [
    ...teamCompetitionSeason,
    createConfirmationStep<ModelType.TEAM_COMPETITION_SEASON>(),
  ],
};

export const getBulkSteps = <T extends ModelType>(
  modelType: T
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
