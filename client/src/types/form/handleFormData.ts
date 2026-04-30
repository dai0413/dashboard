import { FormTypeMap } from "../models";
import { DataSource } from "./common";
import { FormFieldDefinition } from "./field";
import { UpdateMode } from "./update";

type HandleFormDataProps<
  T extends keyof FormTypeMap,
  K extends keyof FormTypeMap[T],
> = {
  key: K;
  value: FormTypeMap[T][K] | undefined;
  field: FormFieldDefinition<T>;
  updateMode?: UpdateMode;
  index?: number;
  dataSource?: DataSource;
};

export type HandleFormData<T extends keyof FormTypeMap> = <
  K extends keyof FormTypeMap[T],
>(
  props: HandleFormDataProps<T, K>,
) => void;

export type ArrayHandleFormData<T extends keyof FormTypeMap> = <
  K extends keyof FormTypeMap[T],
>(
  props: HandleFormDataProps<T, K> & { dataIndex: number },
) => void;
