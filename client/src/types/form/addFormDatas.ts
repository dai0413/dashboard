import { FormTypeMap, ModelType } from "../models";

export type AddFormDatasParams<T extends ModelType> = {
  setPage?: (p: number) => void;
  formData?: FormTypeMap[T];
  formLabel?: Record<string, any>;

  duplicateCheck?: (
    existing: FormTypeMap[T],
    incoming: FormTypeMap[T],
  ) => boolean;
};
