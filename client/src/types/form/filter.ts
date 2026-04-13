import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { OptionType } from "../../utils/createOption";
import { FormTypeMap, ModelType } from "../models";
import { AxiosInstance } from "axios";

export type FilterConditionsByKey = Partial<
  Record<ModelType | OptionType, FilterableFieldDefinition[]>
>;

export type CreateFilterConditions<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K];
  metaData?: Record<string, any>;
  api?: AxiosInstance;
}) => Promise<FilterConditionsByKey | null>;
