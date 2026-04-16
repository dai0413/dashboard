import { Label, QueryParams } from "@dai0413/myorg-shared";
import { ModelType } from "../models";
import { LinkField } from "../types";

export enum ColumnType {
  FIELD = "field",
  CUSTOM = "custom",
}

type Base = {
  id: string;
  label: string;
  width?: string;
  isPrimary?: boolean;
};

type FieldHeader<T> = Base & {
  type: ColumnType.FIELD;
  field: keyof T;
};

type CustomHeader<T> = Base & {
  type: ColumnType.CUSTOM;
  getData: (data: T) => string | Label | (object & { id?: string });
};

export type TableHeader<T> = FieldHeader<T> | CustomHeader<T>;

export type TableBase<T, F> = TableBase1<T> & TableFormProps<F>;

type TableBase1<T> = {
  title?: string;
  headers: TableHeader<T>[];
  modelType?: ModelType | null;
  linkField?: LinkField[];
  pageNation?: "client" | "server";
};

type TableFormProps<F> = {
  formInitialData?: Partial<F>;
};

export type TableFetch<T, F> = TableBase<T, F> & {
  fetch: {
    apiRoute: string;
    params?: QueryParams;
  };
};
