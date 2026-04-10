import { FormStep } from "../../types/form";
import { FormTypeMap } from "../../types/models";
import { From, InputMode } from "../../types/types";

export type FormStepsConfig<T extends keyof FormTypeMap> = {
  [key in InputMode]?: {
    [key in From]?: {
      label: string;
      steps: FormStep<T>[];
    };
  };
};
