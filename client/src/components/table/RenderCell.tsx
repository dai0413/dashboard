import { Link } from "react-router-dom";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { LinkField } from "../../types/types";
import { ColumnType, TableHeader } from "../../types/table";
import { isLabelObject } from "../../utils";
import React from "react";

type BaseRow = {
  key?: string;
  _id?: string;
};

const RenderCell = <T extends BaseRow>(
  header: TableHeader<T>,
  row: T,
  form: boolean,
  linkField?: LinkField[],
): React.ReactNode => {
  if (
    header.type === ColumnType.FIELD &&
    "element" in row &&
    React.isValidElement(row.element)
  ) {
    if (row.key === header.field) return row.element;
  }

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

  const field =
    linkField &&
    linkField.find(
      (field) =>
        header.type === ColumnType.FIELD && field.field === header.field,
    );

  const hasId = (row: any): row is { id: string } => {
    return row && typeof row === "object" && "id" in row;
  };

  // ① オブジェクトでidを持つ場合
  if (!form && field && hasId(value)) {
    if (typeof value.id === "string" && value.id !== "undefined") {
      return (
        <Link
          to={`${field.to}/${value.id}`}
          className="hover:text-blue-600 underline"
        >
          {convertDisplayValue(value)}
        </Link>
      );
    } else {
      return convertDisplayValue(value);
    }
  }

  // ② row._idを使う場合
  if (!form && field && value !== null) {
    if (row._id) {
      return (
        <Link
          to={`${field.to}/${row._id}`}
          className="hover:text-blue-600 underline"
        >
          {convertDisplayValue(value)}
        </Link>
      );
    }
  }

  return convertDisplayValue(value);
};

export default RenderCell;
