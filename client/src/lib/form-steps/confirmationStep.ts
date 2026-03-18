import { FormStep, StepType } from "../../types/form";
import { FormTypeMap, ModelType } from "../../types/models";

export function createConfirmationStep<T extends keyof FormTypeMap>(
  modelType: ModelType,
): FormStep<T> {
  return {
    stepLabel: "最終確認",
    type: StepType.CONFIRM,
    modelType,
  };
}
