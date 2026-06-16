import { AxiosInstance } from "axios";
import {
  FormState,
  FormStep,
  QuickFilterItemsByKey,
} from "../../../types/form";
import { FormTypeMap } from "../../../types/models";

export const createQuickFilterItemsFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: FormStep<T>,
  values: FormState<T>,
  quickFilterItemsObj: QuickFilterItemsByKey | null,
): Promise<QuickFilterItemsByKey | null> => {
  let newQuickConditionsObj = quickFilterItemsObj;

  if (currentStep.createQuickFilterItems) {
    const quickFilterItemsObj = await currentStep.createQuickFilterItems({
      data: values.formData,
      metaData: values.metaData,
      api,
    });

    newQuickConditionsObj = {
      ...newQuickConditionsObj,
      ...quickFilterItemsObj,
    };
  }

  return newQuickConditionsObj;
};
