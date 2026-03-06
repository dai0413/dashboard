import { FormStep } from "../../types/form";
import { FormTypeMap, ModelType } from "../../types/models";

export function createConfirmationStep<T extends keyof FormTypeMap>(
  nextModelType?: ModelType,
): FormStep<T> {
  return {
    stepLabel: "最終確認",
    type: "confirm",
    nextModelType,
    send: true,
  };
}
