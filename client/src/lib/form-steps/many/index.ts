import { ModelType } from "../../../types/models";
import { createConfirmationStep } from "../confirmationStep";
import { nationalCallUp } from "./national-callup";

export const manyDataSteps = {
  [ModelType.NATIONAL_CALLUP]: [
    ...nationalCallUp,
    createConfirmationStep<ModelType.NATIONAL_CALLUP>(),
  ],
};
