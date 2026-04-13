import { FormStep } from "../../../types/form";
import { FormTypeMap } from "../../../types/models";
import { From, GetStepsArgs } from "../../../types/types";
import { formStepsMap } from "./formStepsMap";

export const getSteps = <T extends keyof FormTypeMap>({
  modelType,
  inputMode,
  from = From.NORMAL,
}: GetStepsArgs<T>): {
  label: string;
  steps: FormStep<T>[];
} | null => {
  return formStepsMap[modelType]?.[inputMode]?.[from] ?? null;
};
