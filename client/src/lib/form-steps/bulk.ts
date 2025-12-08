import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { player } from "./models/player/bulk";
import { nationalCallUp } from "./models/national-callup/bulk";
import { teamCompetitionSeason } from "./models/team-competition-season/bulk";
import { competitionStage } from "./models/competition-stage/bulk";
import { transfer } from "./models/transfer/bulk";
import { injury } from "./models/injury/bulk";
import { matchEventType } from "./models/match-event-type/bulk";

const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.INJURY]: [...injury, createConfirmationStep<ModelType.INJURY>()],
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
  [ModelType.TRANSFER]: [
    ...transfer,
    createConfirmationStep<ModelType.TRANSFER>(),
  ],
  [ModelType.MATCH_EVENT_TYPE]: [
    ...matchEventType,
    createConfirmationStep<ModelType.MATCH_EVENT_TYPE>(),
  ],
};

export const getBulkSteps = <T extends ModelType>(
  modelType: T
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
