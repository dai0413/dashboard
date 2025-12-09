import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { transfer } from "./models/transfer/single";
import { player } from "./models/player/single";
import { injury } from "./models/injury/single";
import { team } from "./models/team/single";
import { country } from "./models/country/single";
import { nationalMatchSeries } from "./models/national-match-series/single";
import { nationalCallUp } from "./models/national-callup/single";
import { FormStep } from "../../types/form";
import { referee } from "./models/referee/single";
import { competition } from "./models/competition/single";
import { season } from "./models/season/single";
import { teamCompetitionSeason } from "./models/team-competition-season/single";
import { stadium } from "./models/stadium/single";
import { competitionStage } from "./models/competition-stage/single";
import { matchFormat } from "./models/match-format/single";
import { match } from "./models/match/single";
// import { playerRegistration } from "./models/player-registration";
import { playerRegistrationHistory } from "./models/player-registration-history/single";
import { matchEventType } from "./models/match-event-type/single";
import { formation } from "./models/formation/single";

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
  [ModelType.FORMATION]: [
    ...formation,
    createConfirmationStep<ModelType.FORMATION>(),
  ],
  [ModelType.INJURY]: [...injury, createConfirmationStep<ModelType.INJURY>()],
  [ModelType.MATCH_EVENT_TYPE]: [
    ...matchEventType,
    createConfirmationStep<ModelType.MATCH_EVENT_TYPE>(),
  ],
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
