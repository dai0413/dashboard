import { AxiosInstance } from "axios";
import { FormState, FormStep } from "../../../types/form";
import { OptionObj } from "../../../types/form/option";
import { FormTypeMap } from "../../../types/models";

export const addOptionsFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: FormStep<T>,
  values: FormState<T>,
  options: Record<string, OptionObj<any>>,
): Promise<Record<string, OptionObj<any>>> => {
  let newOptions = options;

  if (currentStep.addOptions) {
    const addedOptions = await currentStep.addOptions({
      data: values.formData,
      metaData: values.metaData,
      api,
      formLabel: values.formLabel,
    });
    newOptions = { ...options, ...addedOptions };
  }

  return newOptions;
};
