import { AxiosInstance } from "axios";
import {
  ArrayDataFormStep,
  DataSource,
  FormState,
  FormStep,
  RecordDataFormStep,
} from "../../../types/form";
import { FormTypeMap } from "../../../types/models";

export const onChangeFun = async <T extends keyof FormTypeMap>(
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
    const result = await onChangeBulkFun(api, currentStep, values);

    formDatas = result.formDatas;
    formLabels = result.formLabels;
  } else {
    const result = await onChangeSingleFun(api, currentStep, values);

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

const onChangeSingleFun = async <T extends keyof FormTypeMap>(
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

  if (currentStep.onChange) {
    const onChange = currentStep.onChange;

    if (currentStep.dataSource === DataSource.BULK_COMMON) {
      const {
        formData: onChangedBulkCommonData,
        formLabel: onChangedBulkCommonLabel,
      } = await onChange({
        formData: bulkCommonData,
        formLabel: bulkCommonLabel,
        metaData,
        api,
      });
      newBulkCommonData = {
        ...newBulkCommonData,
        ...onChangedBulkCommonData,
      };
      newBulkCommonLabel = {
        ...newBulkCommonLabel,
        ...onChangedBulkCommonLabel,
      };
    } else {
      // formData更新
      const { formData: onChangedFormData, formLabel: onChangedFormLabel } =
        await onChange({ formData, formLabel, metaData, api });
      newFormData = { ...newFormData, ...onChangedFormData };
      newFormLabel = { ...newFormLabel, ...onChangedFormLabel };
    }
  }

  return {
    formData: newFormData,
    formLabel: newFormLabel,
    bulkCommonData: newBulkCommonData,
    bulkCommonLabel: newBulkCommonLabel,
  };
};

const onChangeBulkFun = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  currentStep: ArrayDataFormStep<T>,
  values: FormState<T>,
) => {
  const { formDatas, formLabels, metaData } = values;
  let newFormDatas = values.formDatas;
  let newFormLabels = values.formLabels;

  if (currentStep.onChange) {
    const onChange = currentStep.onChange;
    const { formDatas: onChangedFormDatas, formLabels: onChangedFormLabels } =
      await onChange({
        formDatas,
        formLabels,
        metaData,
        api,
      });

    newFormDatas = formDatas.map((formData, index) => ({
      ...formData,
      ...onChangedFormDatas[index],
    }));

    newFormLabels = formLabels.map((formLabel, index) => ({
      ...formLabel,
      ...onChangedFormLabels[index],
    }));
  }

  return {
    formDatas: newFormDatas,
    formLabels: newFormLabels,
  };
};
