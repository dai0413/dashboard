import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { player } from "./models/player/d_pc";

export const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.PLAYER]: [...player, createConfirmationStep<ModelType.PLAYER>()],
};

export const getD_PCsteps = <T extends ModelType>(
  modelType: T,
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
