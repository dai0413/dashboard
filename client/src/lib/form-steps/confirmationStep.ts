import { FormStep, FormTypeMap } from "../../types/form";

export function createConfirmationStep<
  T extends keyof FormTypeMap
>(): FormStep<T> {
  return {
    stepLabel: "最終確認",
    type: "confirm",
  };
}
