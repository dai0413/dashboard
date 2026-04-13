import { FormTypeMap } from "../../../types/models";
import { From, GetStepsArgs, InputMode } from "../../../types/types";
import { FormStepsConfig } from "../types";
import { formStepsMap } from "./formStepsMap";

type FormMenuItem<T extends keyof FormTypeMap> = Omit<
  GetStepsArgs<T>,
  "from"
> & {
  from: From;
  label: string;
};

export const createFormMenuItems = <T extends keyof FormTypeMap>(
  modelType: T,
): FormMenuItem<T>[] => {
  if (!modelType || !formStepsMap[modelType]) return [];
  const modelMap: FormStepsConfig<T> = formStepsMap[modelType];

  const items: FormMenuItem<T>[] = Object.entries(modelMap).flatMap(
    ([inputMode, fromMap]) => {
      if (!fromMap) return [];

      return Object.entries(fromMap).map(([from, config]) => ({
        label: config.label,
        modelType: modelType,
        inputMode: inputMode as InputMode,
        from: from as From,
      }));
    },
  );

  return items;
};
