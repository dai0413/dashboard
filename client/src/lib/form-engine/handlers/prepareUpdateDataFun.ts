import { AxiosInstance } from "axios";
import { FormState, FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { FormMode } from "../../../types/types";

export const prepareUpdateDataFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: FormStep<T>,
  values: FormState<T>,
): Promise<FormState<T>> => {
  let {
    draftData,
    formData,
    formLabel,
    metaData,
    metaDataLabel,
    postedDraftData,
    formDatas,
    formLabels,
    originalData,
    originalDatas,
  } = values;

  if (
    currentStep.nextFormMode === FormMode.UPDATE &&
    currentStep.prepareUpdateData
  ) {
    if (currentStep.many) {
      const newData = await currentStep.prepareUpdateData({
        formDatas,
        metaData,
        api,
        draftData,
        formLabels,
      });
      originalDatas = newData.originalDatas;
      formDatas = newData.formDatas;
      formLabels = newData.formLabels;
      metaData = newData.metaData;
      metaDataLabel = newData.metaDataLabel;
    } else {
      const newData = await currentStep.prepareUpdateData({
        formData,
        metaData,
        api,
        draftData,
        formLabel,
      });
      originalData = newData.originalData;
      metaData = newData.metaData;
      metaDataLabel = newData.metaDataLabel;
      formData = newData.formData;
      formLabel = newData.formLabel;
    }
  }

  return {
    ...values,
    draftData,
    formData,
    formLabel,
    metaData,
    metaDataLabel,
    postedDraftData,
    formDatas,
    formLabels,
    originalData,
    originalDatas,
  };
};
