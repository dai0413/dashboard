import { Label, QueryParams } from "@dai0413/myorg-shared";
import { FormTypeMap, ModelType } from "../models";
import { LinkField } from "../types";

export type TableHeader = {
  label: string;
  field: string;
  getData?: (data: any) => string | Label;
  width?: string;
  isPrimary?: boolean;
};

export type TableBase<K extends ModelType> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  linkField?: LinkField[];
  pageNation?: "client" | "server";
};

export type TableFetch<K extends ModelType> = TableBase<K> & {
  fetch: {
    apiRoute: string;
    params?: QueryParams;
  };
};
