import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { player } from "./models/player/d_pc";
import { playerRegistrationHistory } from "./models/player-registration-history/d_pc";

export const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.PLAYER]: [
    ...player,
    createConfirmationStep<ModelType.PLAYER>(ModelType.PLAYER),
  ],
  [ModelType.PLAYER_REGISTRATION_HISTORY]: [
    ...playerRegistrationHistory,
    createConfirmationStep<ModelType.PLAYER_REGISTRATION_HISTORY>(
      ModelType.PLAYER_REGISTRATION_HISTORY,
    ),
  ],
};

export const getD_PCsteps = <T extends ModelType>(
  modelType: T,
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
