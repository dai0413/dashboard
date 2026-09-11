import { BaseField, Label } from "@dai0413/myorg-shared";

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

type DataValue = Label | Label[];

export type RenderCellValue = {
  label: string;
  to?: string;
};

type CustomHeader<T> = BaseField &
  TableHeaderBase & {
    getValueType: ColumnType.CUSTOM;
    getData: (data: T) => DataValue;
  };

export type TableHeader<T> = FieldHeader<T> | CustomHeader<T>;
