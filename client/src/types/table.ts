import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@myorg/shared";
import { QueryParams } from "../lib/api/readItems";
import { CrudRouteWithParams } from "../lib/apiRoutes";
import { FormTypeMap, ModelType } from "./models";
import { LinkField, TableHeader } from "./types";

export type TableBase<K extends ModelType> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  linkField?: LinkField[];
};

export type TableFetch = {
  fetch: {
    apiRoute: CrudRouteWithParams<any>;
    path?: CrudRouteWithParams<any>["path"];
    params?: QueryParams;
  };
};

export type TableOperationFields = {
  filterField?: FilterableFieldDefinition[];
  sortField?: SortableFieldDefinition[];
  detailLinkValue?: string | null;
};
