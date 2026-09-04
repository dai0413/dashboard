import { JSX } from "react";
import { FormTypeMap } from "../models";
import { ArrayHandleFormData } from "./handleFormData";
import { UpdateData } from "./update";
import { AddFormDatasParams } from "./addFormDatas";

export type Many<T extends keyof FormTypeMap> = {
  bulkCommonData: FormTypeMap[T];
  bulkCommonLabel: Record<string, any>;
  handleFormData: ArrayHandleFormData<T>;
  addFormDatas: (params: AddFormDatasParams<T>) => void;
  deleteFormDatas: (index: number) => void;
  renderConfirmMes: (
    confirmData: Record<string, string | number | undefined>[],
  ) => JSX.Element;
  state: Record<string, any>[];
  stateLabel: Record<string, any>[];

  originalDatas: UpdateData<FormTypeMap[T]>[] | null;
};
