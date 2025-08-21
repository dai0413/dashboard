import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { createConfirmationStep } from "../confirmationStep";
import { nationalCallUp } from "./national-callup";

const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.NATIONAL_CALLUP]: [
    ...nationalCallUp,
    createConfirmationStep<ModelType.NATIONAL_CALLUP>(),
  ],
};

export const getBulkSteps = <T extends ModelType>(
  modelType: T
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
