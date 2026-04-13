import { AxiosInstance } from "axios";
import { OptionType } from "../../utils/createOption";
import { FormTypeMap, ModelType } from "../models";
import { QuickFilterItem } from "../table";

export type QuickFilterItemsByKey = Partial<
  Record<ModelType | OptionType, QuickFilterItem[]>
>;

export type CreateQuickFilterItems<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K];
  metaData?: Record<string, any>;
  api?: AxiosInstance;
}) => Promise<QuickFilterItemsByKey | null>;
