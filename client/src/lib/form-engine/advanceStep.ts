import { AxiosInstance } from "axios";
import {
  ApplyStateValue,
  FilterConditionsByKey,
  FormState,
  FormStep,
  QuickFilterItemsByKey,
} from "../../types/form";
import { FormTypeMap } from "../../types/models";
import { runStepEffects } from "./runStepEffects";
import { OptionObj } from "../../types/form/option";

export const advanceStep = async <T extends keyof FormTypeMap>(
  api: AxiosInstance,
  formSteps: FormStep<T>[],
  values: FormState<T>,
  prev: {
    options: Record<string, OptionObj<any>>;
    filterConditionsObj: FilterConditionsByKey | null;
    quickFilterItemsObj: QuickFilterItemsByKey | null;
  },
  curInd?: number,
): Promise<{ index: number; result: ApplyStateValue<T> }> => {
  const { formData, metaData } = values;
  const { options, filterConditionsObj, quickFilterItemsObj } = prev;

  const shouldSkip = (
    index: number,
    formData: FormTypeMap[T],
    metaData: Record<string, any>,
  ) => {
    const step = formSteps[index];

    if (!step || step.many || !step.skip) return false;

    return step.skip(formData, metaData);
  };

  let nextIndex = curInd ? Math.min(curInd + 1, formSteps.length - 1) : 0;

  let result = await runStepEffects(api, formSteps[curInd || 0], values, {
    options,
    filterConditionsObj,
    quickFilterItemsObj,
  });

  while (
    nextIndex < formSteps.length - 1 &&
    shouldSkip(nextIndex, formData, metaData)
  ) {
    result = await runStepEffects(api, formSteps[nextIndex], result.values, {
      options,
      filterConditionsObj,
      quickFilterItemsObj,
    });

    nextIndex++;
  }

  return { index: nextIndex, result };
};
