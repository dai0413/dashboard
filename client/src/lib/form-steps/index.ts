import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { transfer } from "./transfer";
import { player } from "./player";
import { injury } from "./injury";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";
import { nationalCallUp } from "./national-callup";
import { FormStep } from "../../types/form";
import { referee } from "./referee";
import { competition } from "./competition";
import { season } from "./season";
import { teamCompetitionSeason } from "./team-competition-season";
import { stadium } from "./stadium";
import { competitionStage } from "./competition-stage";
import { matchFormat } from "./match-format";
import { match } from "./match";
// import { playerRegistration } from "./player-registration";
import { playerRegistrationHistory } from "./player-registration-history";

export const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.COMPETITION_STAGE]: [
    ...competitionStage,
    createConfirmationStep<ModelType.COMPETITION_STAGE>(),
  ],
  [ModelType.COMPETITION]: [
    ...competition,
    createConfirmationStep<ModelType.COMPETITION>(),
  ],
  [ModelType.COUNTRY]: [
    ...country,
    createConfirmationStep<ModelType.COUNTRY>(),
  ],
  [ModelType.INJURY]: [...injury, createConfirmationStep<ModelType.INJURY>()],
  [ModelType.MATCH]: [...match, createConfirmationStep<ModelType.MATCH>()],
  [ModelType.MATCH_FORMAT]: [
    ...matchFormat,
    createConfirmationStep<ModelType.MATCH_FORMAT>(),
  ],
  [ModelType.NATIONAL_CALLUP]: [
    ...nationalCallUp,
    createConfirmationStep<ModelType.NATIONAL_CALLUP>(),
  ],
  [ModelType.NATIONAL_MATCH_SERIES]: [
    ...nationalMatchSeries,
    createConfirmationStep<ModelType.NATIONAL_MATCH_SERIES>(),
  ],
  [ModelType.PLAYER_REGISTRATION_HISTORY]: [
    ...playerRegistrationHistory,
    createConfirmationStep<ModelType.PLAYER_REGISTRATION_HISTORY>(),
  ],
  // [ModelType.PLAYER_REGISTRATION]: [
  //   ...playerRegistration,
  //   createConfirmationStep<ModelType.PLAYER_REGISTRATION>(),
  // ],
  [ModelType.PLAYER]: [...player, createConfirmationStep<ModelType.PLAYER>()],
  [ModelType.REFEREE]: [
    ...referee,
    createConfirmationStep<ModelType.REFEREE>(),
  ],
  [ModelType.SEASON]: [...season, createConfirmationStep<ModelType.SEASON>()],
  [ModelType.STADIUM]: [
    ...stadium,
    createConfirmationStep<ModelType.STADIUM>(),
  ],
  [ModelType.TEAM_COMPETITION_SEASON]: [
    ...teamCompetitionSeason,
    createConfirmationStep<ModelType.TEAM_COMPETITION_SEASON>(),
  ],
  [ModelType.TEAM]: [...team, createConfirmationStep<ModelType.TEAM>()],
  [ModelType.TRANSFER]: [
    ...transfer,
    createConfirmationStep<ModelType.TRANSFER>(),
  ],
};

export const getSingleSteps = <T extends ModelType>(
  modelType: T
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
