import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ColumnType, TableHeader } from "../../types/table";
import { isLabelObject } from "../data/isLabelObject";

export const toDisplayValue = <T>(header: TableHeader<T>, row: T): string => {
  const value =
    header.getValueType === ColumnType.CUSTOM
      ? header.getData(row)
      : row[header.field];

  const convertDisplayValue = (value: unknown): string => {
    if (typeof value === "undefined") return "";

    if (value == null) return "";

    if (isLabelObject(value)) return value.label;

    if (Array.isArray(value)) {
      if (value.some((v) => isLabelObject(v))) {
        return value.map((v) => v.abbr).join(",");
      }

      return value.join(", ");
    }

    if (header.type === "Date") {
      return toDateKey(value as string, false) || "";
    }

    if (header.type === "datetime-local") {
      return toDateKey(value as string, true) || "";
    }

    if (value instanceof Date) return toDateKey(value, false) || "";

    return String(value);
  };

  return convertDisplayValue(value);
};
