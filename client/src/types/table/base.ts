import { BaseField, Label, QueryParams } from "@dai0413/myorg-shared";
import { ModelType } from "../models";
import { LinkField } from "../types";
import { UIFieldDefinition } from "../field";

export enum ColumnType {
  FIELD = "field",
  CUSTOM = "custom",
}

type TableHeaderBase = {
  width?: string;
  isPrimary?: boolean;
  displayOnTable: boolean;
};

type FieldHeader<T> = BaseField &
  TableHeaderBase & {
    getValueType: ColumnType.FIELD;
    field: keyof T;
  };

export type DataValue =
  | string
  | Label
  | Label[]
  | (object & { id?: string })
  | (object & { id?: string })[];

export type RenderCellValue = Label & {
  to?: string;
};

type CustomHeader<T> = BaseField &
  TableHeaderBase & {
    getValueType: ColumnType.CUSTOM;
    getData: (data: T) => DataValue;
  };

export type TableHeader<T> = FieldHeader<T> | CustomHeader<T>;

export type TableBase<T, F> = TableBase1<T> & TableFormProps<F>;

type TableBase1<T> = {
  title?: string;
  fieldDefinitions: UIFieldDefinition<T>[];
  modelType?: ModelType | null;
  linkField?: LinkField[];
  pageNation?: "client" | "server";
};

type TableFormProps<F> = {
  initialData?: {
    formData?: Partial<F>;
    metaData?: Record<string, any>;
  };
};

export type TableFetch<T, F> = TableBase<T, F> & {
  fetch: {
    apiRoute: string;
    params?: QueryParams;
  };
};
