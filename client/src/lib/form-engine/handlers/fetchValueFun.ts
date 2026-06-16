import { AxiosInstance } from "axios";
import { FormState, FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { resolveForeignKeyLabels } from "../../../utils/data/resolveForeignKeyLabels";

export const fetchValueFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: FormStep<T>,
  state: FormState<T>,
): Promise<FormState<T>> => {
  let { formData, formDatas, formLabels } = state;

  if (currentStep.many && currentStep.fetchValue) {
    const fetchValue = currentStep.fetchValue;

    formDatas = await fetchValue(formData, api);
    formLabels = await Promise.all(
      formDatas.map((v) => resolveForeignKeyLabels(api, v)),
    );
  }

  return { ...state, formDatas, formLabels };
};
