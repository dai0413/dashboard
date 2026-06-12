import { FormTypeMap } from "../models";
import { OptionObj } from "./option";

type FieldCopyResult<K extends keyof FormTypeMap> = {
  formData: FormTypeMap[K];
  formLabel: Record<string, any>;
};

type FieldCopySelect<K extends keyof FormTypeMap> = (
  row: OptionObj<any>["data"][number],
) => Promise<FieldCopyResult<K>>;

export type FieldCopy<K extends keyof FormTypeMap> = {
  label: string;
  optionKey: string;
  onSelect: FieldCopySelect<K>;
  duplicateCheck: (
    existing: FormTypeMap[K],
    incoming: FormTypeMap[K],
  ) => boolean;
  getDisplayData: (formDatas: Record<string, any>[]) => Record<string, any>;
};
