import { AxiosInstance } from "axios";
import { OptionsMap } from "../../utils/createOption/types/base";
import { FormTypeMap } from "../models";
import { QuickFilterItem } from "../table";

export type QuickFilterItemsByKey = Partial<
  Record<keyof OptionsMap, QuickFilterItem[]>
>;

export type CreateQuickFilterItems<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K];
  metaData?: Record<string, any>;
  api?: AxiosInstance;
}) => Promise<QuickFilterItemsByKey | null>;
