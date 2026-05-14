import { AxiosInstance } from "axios";
import { UIFieldDefinition } from "../field";
import { FormTypeMap } from "../models";

export type Base = { key: string; label: string } & Record<string, any>;

export type OptionArray = Base[];

export type OptionObj<T> = {
  data: T[];
  fields?: UIFieldDefinition<T>[];
  page?: number;
  totalCount?: number;
};

export enum OptionSource {
  PRESET = "preset", // 既定値
  CUSTOM = "custom", // 手動データ
  REMOTE = "remote", // API取得
}

export type AddOptions<K extends keyof FormTypeMap> = (args: {
  data: FormTypeMap[K] & Record<string, any>;
  metaData: Record<string, any>;
  api: AxiosInstance;
  formLabel: Record<string, any>;
}) => Promise<Record<string, OptionObj<Base>>>;
