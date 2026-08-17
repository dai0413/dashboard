import { AxiosInstance } from "axios";
import {
  ApplyStateValue,
  FilterConditionsByKey,
  FormState,
  FormStep,
  QuickFilterItemsByKey,
} from "../../types/form";
import {
  addOptionsFun,
  createFilterConditionsFun,
  createQuickFilterItemsFun,
  draftDataFun,
  fetchValueFun,
  onChangeFun,
  prepareUpdateDataFun,
} from "./handlers";
import { FormTypeMap } from "../../types/models";
import { OptionObj } from "../../types/form/option";

export const runStepEffects = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  step: FormStep<T>,
  values: FormState<T>,
  prev: {
    options: Record<string, OptionObj<any>>;
    filterConditionsObj: FilterConditionsByKey | null;
    quickFilterItemsObj: QuickFilterItemsByKey | null;
  },
): Promise<ApplyStateValue<T>> => {
  const { options, filterConditionsObj, quickFilterItemsObj } = prev;
  values = await onChangeFun(api, step, values);
  values = await fetchValueFun(api, step, values);
  values = await draftDataFun(api, step, values);
  values = await prepareUpdateDataFun(api, step, values);

  const newOptions = await addOptionsFun(api, step, values, options);
  const newFilterConditionsObj = await createFilterConditionsFun(
    api,
    step,
    values,
    filterConditionsObj,
  );

  const newQuickFilterItemsObj = await createQuickFilterItemsFun(
    api,
    step,
    values,
    quickFilterItemsObj,
  );

  return {
    values,
    options: newOptions,
    filterConditionsObj: newFilterConditionsObj,
    quickFilterItemsObj: newQuickFilterItemsObj,
  };
};
