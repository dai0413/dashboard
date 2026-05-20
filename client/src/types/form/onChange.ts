import { AxiosInstance } from "axios";
import { FormTypeMap } from "../models";

type BaseArgs = {
  metaData: Record<string, any>;
  api: AxiosInstance;
};

type OnChangeArgs<K extends keyof FormTypeMap, T extends boolean> = BaseArgs &
  (T extends true
    ? {
        formDatas: FormTypeMap[K][];
        formLabels: Record<string, any>[];
      }
    : {
        formData: FormTypeMap[K];
        formLabel: Record<string, any>;
      });

export type OnChange<K extends keyof FormTypeMap, T extends boolean> = (
  args: OnChangeArgs<K, T>,
) => T extends true
  ? Promise<{
      formDatas: FormTypeMap[K][];
      formLabels: Record<string, any>[];
    }>
  : Promise<{
      formData: FormTypeMap[K];
      formLabel: Partial<Record<string, any>>;
    }>;
