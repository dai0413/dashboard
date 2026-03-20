import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";
import { createConfirmationStep } from "./confirmationStep";
import { staff } from "./models/staff/d_sc";
import { staffRegistrationHistory } from "./models/staff-registration-history/d_sc";

export const steps: Partial<Record<ModelType, FormStep<any>[]>> = {
  [ModelType.STAFF]: [
    ...staff,
    createConfirmationStep<ModelType.STAFF>(ModelType.STAFF),
  ],
  [ModelType.STAFF_REGISTRATION_HISTORY]: [
    ...staffRegistrationHistory,
    createConfirmationStep<ModelType.STAFF_REGISTRATION_HISTORY>(
      ModelType.STAFF_REGISTRATION_HISTORY,
    ),
  ],
};

export const getD_SCsteps = <T extends ModelType>(
  modelType: T,
): FormStep<T>[] => {
  return (steps[modelType] as FormStep<T>[] | undefined) ?? [];
};
