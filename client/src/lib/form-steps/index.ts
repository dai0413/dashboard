import { ModelType } from "../../types/models";
import { FormStep } from "../../types/form";
import { getBulkSteps } from "./bulk";
import { getSingleSteps } from "./single";
import { getD_PCsteps } from "./d_pc";
import { From } from "../../types/types";

export const getSteps = <T extends ModelType>(
  modelType: T,
  bulk?: boolean,
  from?: From,
): FormStep<T>[] => {
  if (from === From.D_PC) return getD_PCsteps(modelType);
  if (bulk) return getBulkSteps(modelType);
  return getSingleSteps(modelType);
};

export const hasSteps = <T extends ModelType>(modelType: T): boolean => {
  const bulk = getBulkSteps(modelType);
  const single = getSingleSteps(modelType);

  return bulk.length > 0 || single.length > 0;
};
