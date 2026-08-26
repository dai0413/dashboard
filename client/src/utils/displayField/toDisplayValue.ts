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
  renderCellValue: RenderCellValue[] | RenderCellValue;
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
  const field = linkField?.find((field) => field.field === header.key);

  const rawValue =
    header.getValueType === ColumnType.CUSTOM
      ? header.getData(row)
      : row[header.field];

  // row._idまたは , row[field.field].idがリンク先あり
  const isLink =
    linkField?.some((field) => field.field === header.key) &&
    typeof row === "object" &&
    row !== null &&
    "_id" in row &&
    typeof row._id === "string" &&
    !!rawValue;

  const value =
    isLink && !isLabelObject(rawValue) && typeof rawValue === "string"
      ? {
          id: row._id,
          label: String(rawValue),
        }
      : isLink &&
          typeof rawValue === "object" &&
          !("id" in rawValue) &&
          "label" in rawValue
        ? {
            id: row._id,
            label: rawValue.label,
          }
        : rawValue;

  const createTo = (value: unknown, field?: LinkField): string | undefined => {
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

    return String(value);
  };

  if (Array.isArray(value)) {
    if (value.every(isLabelObject)) {
      const renderCellValue: RenderCellValue[] = value.map((v) => ({
        id: v.id,
        label: v.label,
        to: createTo(v, field),
      }));

      return {
        renderCellValue,
        title: renderCellValue.map((v) => v.label).join(", "),
      };
    }

    const renderCellValue: RenderCellValue[] = value.map((v) => {
      if (typeof v === "object" && "label" in v) {
        return {
          label: v.label,
        };
      } else {
        return { label: v };
      }
    });

    return {
      renderCellValue,
      title: renderCellValue.map((v) => v.label).join(", "),
    };
  }

  if (isLabelObject(value)) {
    const renderCellValue: RenderCellValue = {
      label: value.label,
      to: createTo(value, field),
    };

    return {
      renderCellValue,
      title: value.label,
    };
  }

  if (value !== null && typeof value === "object" && "label" in value) {
    const renderCellValue: RenderCellValue = {
      label: value.label,
    };

    return {
      renderCellValue,
      title: value.label,
    };
  }

  const title = convertDisplayValue(value);

  return {
    renderCellValue: { label: title },
    title,
  };
};
