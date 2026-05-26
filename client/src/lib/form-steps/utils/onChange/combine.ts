import { OnChange, OnChangeReturn } from "../../../../types/form/onChange";

type Single<FORM extends object> = {
  formData: FORM;
  formLabel: Record<string, any>;
};

type Bulk<FORM extends object> = {
  formDatas: FORM[];
  formLabels: Record<string, any>[];
};

const isSingleArgs = <FORM extends object>(
  value: any,
): value is Single<FORM> => {
  return "formData" in value;
};

const isBulkArgs = <FORM extends object>(value: any): value is Bulk<FORM> => {
  return "formDatas" in value;
};

export const combineOnChanges = <FORM extends object, T extends boolean>(
  ...handlers: OnChange<FORM, T>[]
): OnChange<FORM, T> => {
  return async (args) => {
    let currentArgs = { ...args };

    for (const handler of handlers) {
      const prevArgs = currentArgs;
      const result = await handler(currentArgs);

      // single
      if (isSingleArgs(result) && isSingleArgs(prevArgs)) {
        currentArgs = {
          ...prevArgs,
          ...result,

          formData: {
            ...prevArgs.formData,
            ...result.formData,
          },

          formLabel: {
            ...prevArgs.formLabel,
            ...result.formLabel,
          },
        };
      } else if (isBulkArgs(result) && isBulkArgs(prevArgs)) {
        currentArgs = {
          ...prevArgs,
          ...result,

          formDatas: prevArgs.formDatas.map((data, i) => ({
            ...data,
            ...result.formDatas[i],
          })),

          formLabels: prevArgs.formLabels.map((label, i) => ({
            ...label,
            ...result.formLabels[i],
          })),
        };
      }
    }

    return currentArgs as OnChangeReturn<FORM, T>;
  };
};
