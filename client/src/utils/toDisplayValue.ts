import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ColumnType, TableHeader } from "../types/table";
import { isLabelObject } from "./isLabelObject";

export const toDisplayValue = <T>(header: TableHeader<T>, row: T): string => {
  const value =
    header.type === ColumnType.CUSTOM ? header.getData(row) : row[header.field];

  const convertDisplayValue = (value: unknown): string => {
    if (typeof value === "undefined") return "";

    if (value == null) return "";

    if (isLabelObject(value)) return value.label;

    if (Array.isArray(value)) return value.join(", ");

    if (value instanceof Date) return toDateKey(value, false) || "";

    return String(value);
  };

  return convertDisplayValue(value);
};
