import { ModelDataOption, ModelOptionKey } from "./model";
import { AxiosInstance } from "axios";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { DefaultOptionMap, OptionType } from "./preset";
import { CustomOptionType, CustomOptionMap } from "./custom";

export type ReadOptionsParam<T extends ModelOptionKey> = {
  key: T;
  api: AxiosInstance;
  filterConditions?: FilterableFieldDefinition[];
  sortConditions?: SortableFieldDefinition[];
  page: number;
};

export type OptionsMap = {
  // preset
  [K in OptionType]: DefaultOptionMap[K];
} & {
  // model
  [K in keyof ModelDataOption]: ModelDataOption[K];
} & {
  // custom
  [K in CustomOptionType]: CustomOptionMap[K];
};
