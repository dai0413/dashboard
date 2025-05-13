import { FormStep } from "../../types/form";

export function createConfirmationStep<
  T extends Record<string, any>
>(): FormStep<T> {
  return {
    stepLabel: "最終確認",
    type: "confirm",
  };
}
