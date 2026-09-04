import { FormTypeMap } from "../models";
import { HandleFormData } from "./handleFormData";
import { UpdateData } from "./update";

export type Single<T extends keyof FormTypeMap> = {
  handleFormData: HandleFormData<T>;
  state: Record<string, any>;
  stateLabel: Record<string, any>;
  originalData: UpdateData<FormTypeMap[T]> | null;
};
