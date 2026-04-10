import { FormTypeMap } from "../../../types/models";
import { From, InputMode } from "../../../types/types";
import { formStepsMap } from "./formStepsMap";

export const getSteps = ({
  modelType,
  inputMode,
  from,
}: {
  modelType: keyof FormTypeMap;
  inputMode: InputMode;
  from: From;
}) => {
  return formStepsMap[modelType]?.[inputMode]?.[from] ?? null;
};
