import { AlertStatus } from "../../types/alert";
import { FormState, FormStep } from "../../types/form";
import { FormTypeMap } from "../../types/models";

export const validateFun = <T extends keyof FormTypeMap>(
  currentStep: FormStep<T>,
  values: FormState<T>,
): AlertStatus => {
  if (currentStep.many && currentStep.validate) {
    const { formDatas, formLabels, metaDatas, metaDataLabels } = values;

    for (const [i, d] of (formDatas ?? []).entries()) {
      const valid = currentStep.validate(
        { ...d, ...metaDatas[i] },
        { ...formLabels[i], ...metaDataLabels[i] },
      );

      if (!valid.success) {
        return valid;
      }
    }
  } else if (!currentStep.many && currentStep.validate) {
    const { formData, formLabel, metaData, metaDataLabel } = values;

    const valid = currentStep.validate(
      { ...formData, ...metaData },
      { ...formLabel, ...metaDataLabel },
    );
    if (!valid.success) return valid;
  }

  return { success: true };
};
