import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { OptionsMap } from "../../utils/createOption/types/base";
import { FormTypeMap } from "../models";
import { AxiosInstance } from "axios";

export type FilterConditionsByKey = Partial<
  Record<keyof OptionsMap, FilterableFieldDefinition[]>
>;

export type CreateFilterConditions<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K];
  metaData?: Record<string, any>;
  api?: AxiosInstance;
}) => Promise<FilterConditionsByKey | null>;
