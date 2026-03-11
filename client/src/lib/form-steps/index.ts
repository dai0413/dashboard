import { ModelType } from "../../types/models";
import { FormStep } from "../../types/form";
import { getBulkSteps } from "./bulk";
import { getSingleSteps } from "./single";
import { getD_PCsteps } from "./d_pc";
import { From } from "../../types/types";
import { getD_SCsteps } from "./d_sc";
import { getJ_Msteps } from "./j_m";

export const getSteps = <T extends ModelType>(
  modelType: T,
  bulk?: boolean,
  from?: From,
  all?: boolean,
): FormStep<T>[] => {
  if (from === From.D_PC) return getD_PCsteps(modelType);
  if (from === From.D_SC) return getD_SCsteps(modelType);
  if (from === From.J_M) return getJ_Msteps(modelType, all);
  if (bulk) return getBulkSteps(modelType);
  return getSingleSteps(modelType);
};

export const hasSteps = <T extends ModelType>(modelType: T): boolean => {
  const bulk = getBulkSteps(modelType);
  const single = getSingleSteps(modelType);

  return bulk.length > 0 || single.length > 0;
};
