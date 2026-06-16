import { AxiosInstance } from "axios";
import { FormState, FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";

export const draftDataFun = async <T extends keyof FormTypeMap>(
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
  } = values;

  if (currentStep.addDraftData) {
    draftData = await currentStep.addDraftData({
      data: formData,
      metaData,
      api,
      postedDraftData,
      draftData,
      formLabel,
    });
  }

  if (currentStep.getDraftData) {
    if (currentStep.many) {
      const gettedDraftData = await currentStep.getDraftData({
        draftData,
        postedDraftData,
        metaData,
        formLabel: {
          ...metaDataLabel,
          ...formLabel,
        },
        api,
      });
      if (gettedDraftData) {
        formDatas = gettedDraftData.value;
        formLabels = gettedDraftData.label;
      }
    } else {
      const gettedDraftData = await currentStep.getDraftData({
        draftData,
        postedDraftData,
        metaData,
        formLabel: {
          ...metaDataLabel,
          ...formLabel,
        },
        api,
      });
      if (gettedDraftData) {
        formData = gettedDraftData.value;
        formLabel = gettedDraftData.label;
      }
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
  };
};
