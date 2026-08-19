import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ColumnType, RenderCellValue, TableHeader } from "../../types/table";
import { isLabelObject } from "../data/isLabelObject";
import { LinkField } from "../../types/types";

const hasId = (value: unknown): value is { id: string } => {
  return (
    value !== null &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string"
  );
};

const hasObjectId = (value: unknown): value is { _id: string } => {
  return (
    value !== null &&
    typeof value === "object" &&
    "_id" in value &&
    typeof value._id === "string"
  );
};

export const toDisplayValue = <T>(
  header: TableHeader<T>,
  row: T,
  linkField?: LinkField[],
): {
  renderCellValue: RenderCellValue[] | string | RenderCellValue;
  title: string;
} => {
  const convertDisplayValue = (value: unknown): string => {
    if (value == null) return "";

    if (isLabelObject(value)) {
      return value.label;
    }

    if (header.type === "Date") {
      return toDateKey(value as string, false) || "";
    }

    if (header.type === "datetime-local") {
      return toDateKey(value as string, true) || "";
    }

    if (value instanceof Date) {
      return toDateKey(value, false) || "";
    }

    return String(value);
  };

  const value =
    header.getValueType === ColumnType.CUSTOM
      ? header.getData(row)
      : row[header.field];

  const field = linkField?.find((field) => field.field === header.key);

  const createTo = (value: unknown): string | undefined => {
    if (!field) return undefined;

    if (typeof value === "object" && value !== null) {
      if (hasId(value)) {
        return `${field.to}/${value.id}`;
      }

      if (hasObjectId(value)) {
        return `${field.to}/${value._id}`;
      }
    }

    if (hasObjectId(row)) {
      return `${field.to}/${row._id}`;
    }

    return undefined;
  };

  if (Array.isArray(value)) {
    if (value.every(isLabelObject)) {
      const renderCellValue: RenderCellValue[] = value.map((v) => ({
        id: v.id,
        label: v.label,
        to: createTo(v),
      }));

      return {
        renderCellValue,
        title: renderCellValue.map((v) => v.label).join(", "),
      };
    }

    const title = value.map(convertDisplayValue).join(", ");

    return {
      renderCellValue: title,
      title,
    };
  }

  if (isLabelObject(value)) {
    const renderCellValue: RenderCellValue = {
      id: value.id,
      label: value.label,
      to: createTo(value),
    };

    return {
      renderCellValue,
      title: value.label,
    };
  }

  const renderCellValue = convertDisplayValue(value);

  return {
    renderCellValue,
    title: renderCellValue,
  };
};
