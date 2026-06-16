import { AxiosInstance } from "axios";
import {
  FilterConditionsByKey,
  FormState,
  FormStep,
} from "../../../types/form";
import { FormTypeMap } from "../../../types/models";

export const createFilterConditionsFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: FormStep<T>,
  values: FormState<T>,
  filterConditionsObj: FilterConditionsByKey | null,
): Promise<FilterConditionsByKey | null> => {
  let newFilterConditionsObj = filterConditionsObj;
  if (currentStep.createFilterConditions) {
    const filterConditions = await currentStep.createFilterConditions({
      data: values.formData,
      metaData: values.metaData,
      api,
    });

    newFilterConditionsObj = {
      ...newFilterConditionsObj,
      ...filterConditions,
    };
  }

  return newFilterConditionsObj;
};
