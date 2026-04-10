import { FormTypeMap } from "../../../types/models";
import { formStepsMap } from "./formStepsMap";

export const hasSteps = (modelType: keyof FormTypeMap) => {
  return !!formStepsMap[modelType];
};
