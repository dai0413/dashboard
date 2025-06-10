import { FormStep } from "../../types/form";
import { FormTypeMap } from "../../types/models";

export function createConfirmationStep<
  T extends keyof FormTypeMap
>(): FormStep<T> {
  return {
    stepLabel: "最終確認",
    type: "confirm",
  };
}
