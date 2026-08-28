import { AxiosInstance } from "axios";
import {
  ArrayDataFormStep,
  DataSource,
  FormState,
  FormStep,
  RecordDataFormStep,
} from "../../../types/form";
import { FormTypeMap } from "../../../types/models";

export const prepareNextFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: FormStep<T>,
  values: FormState<T>,
): Promise<FormState<T>> => {
  let {
    formData,
    formLabel,
    bulkCommonData,
    bulkCommonLabel,
    formDatas,
    formLabels,
  } = values;

  if (currentStep.many) {
    const result = await prepareNextBulkFun(api, currentStep, values);

    formDatas = result.formDatas;
    formLabels = result.formLabels;
  } else {
    const result = await prepareNextSingleFun(api, currentStep, values);

    formData = result.formData;
    formLabel = result.formLabel;
    bulkCommonData = result.bulkCommonData;
    bulkCommonLabel = result.bulkCommonLabel;
  }

  return {
    ...values,
    formData,
    formLabel,
    bulkCommonData,
    bulkCommonLabel,
    formDatas,
    formLabels,
  };
};

const prepareNextSingleFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: RecordDataFormStep<T>,
  values: FormState<T>,
) => {
  const { formData, formLabel, bulkCommonData, bulkCommonLabel, metaData } =
    values;
  let newFormData = formData;
  let newFormLabel = formLabel;

  let newBulkCommonData = bulkCommonData;
  let newBulkCommonLabel = bulkCommonLabel;

  if (currentStep.prepareNext) {
    const prepareNext = currentStep.prepareNext;

    if (currentStep.dataSource === DataSource.BULK_COMMON) {
      const {
        formData: preparedBulkCommonData,
        formLabel: preparedBulkCommonLabel,
      } = await prepareNext({
        formData: bulkCommonData,
        formLabel: bulkCommonLabel,
        metaData,
        api,
      });
      newBulkCommonData = {
        ...newBulkCommonData,
        ...preparedBulkCommonData,
      };
      newBulkCommonLabel = {
        ...newBulkCommonLabel,
        ...preparedBulkCommonLabel,
      };
    } else {
      // formData更新
      const { formData: preparedFormData, formLabel: preparedFormLabel } =
        await prepareNext({ formData, formLabel, metaData, api });
      newFormData = { ...newFormData, ...preparedFormData };
      newFormLabel = { ...newFormLabel, ...preparedFormLabel };
    }
  }

  return {
    formData: newFormData,
    formLabel: newFormLabel,
    bulkCommonData: newBulkCommonData,
    bulkCommonLabel: newBulkCommonLabel,
  };
};

const prepareNextBulkFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: ArrayDataFormStep<T>,
  values: FormState<T>,
) => {
  const { formDatas, formLabels, metaData } = values;
  let newFormDatas = values.formDatas;
  let newFormLabels = values.formLabels;

  if (currentStep.prepareNext) {
    const prepareNext = currentStep.prepareNext;
    const { formDatas: preparedFormDatas, formLabels: preparedFormLabels } =
      await prepareNext({
        formDatas,
        formLabels,
        metaData,
        api,
      });

    newFormDatas = formDatas.map((formData, index) => ({
      ...formData,
      ...preparedFormDatas[index],
    }));

    newFormLabels = formLabels.map((formLabel, index) => ({
      ...formLabel,
      ...preparedFormLabels[index],
    }));
  }

  return {
    formDatas: newFormDatas,
    formLabels: newFormLabels,
  };
};
