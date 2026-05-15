import { FormTypeMap, ModelType } from "../models";

export enum UpdateMode {
  REPLACE = "replace",
  TOGGLE = "toggle",
  ARRAY_UPDATE = "arrayUpdate",
}

export type UpdateData<T extends ModelType> = FormTypeMap[T] & { _id: string };
