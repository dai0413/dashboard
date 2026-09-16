import { FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { GetStepsArgs } from "../../../types/types";
import { formStepsMap } from "./formStepsMap";

type GetStepsReturnVal<T extends keyof FormTypeMap> = {
  label: string;
  steps: FormStep<T>[];
};

export const getSteps = <T extends keyof FormTypeMap>(
  props: GetStepsArgs<T>,
): GetStepsReturnVal<T> | null => {
  const { modelType, inputMode, from } = props;

  return formStepsMap[modelType]?.[inputMode]?.[from] ?? null;
};
