import { ModelType } from "../../types/models";
import { FormStep } from "../../types/form";
import { getBulkSteps } from "./bulk";
import { getSingleSteps } from "./single";

export const getSteps = <T extends ModelType>(
  modelType: T,
  bulk?: boolean
): FormStep<T>[] => {
  return bulk ? getBulkSteps(modelType) : getSingleSteps(modelType);
};

export const hasSteps = <T extends ModelType>(modelType: T): boolean => {
  const bulk = getBulkSteps(modelType);
  const single = getSingleSteps(modelType);

  return bulk.length > 0 || single.length > 0;
};
