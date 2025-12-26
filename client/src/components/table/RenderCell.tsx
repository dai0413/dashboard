import { LinkField, TableHeader } from "../../types/types";
import { Link } from "react-router-dom";
import { isLabelObject, toDateKey } from "../../utils";
import React from "react";

const RenderCell = (
  header: TableHeader,
  row: Record<string, any>,
  form: boolean,
  linkField?: LinkField[]
): React.ReactNode => {
  if ("element" in row && React.isValidElement(row.element)) {
    if (row.key === header.field) return row.element;
  }

  const value = header.getData ? header.getData(row) : row[header.field];

  const isObject = isLabelObject(value);
  let content = value;

  if (Array.isArray(value)) {
    content = value.join(", ");
  } else if (header.field === "date" || value instanceof Date) {
    content = toDateKey(value, false);
  }
  const field =
    linkField && linkField.find((field) => field.field === header.field);

  // ① オブジェクトでidを持つ場合
  if (!form && field && typeof value === "object" && value !== null) {
    if (typeof value.id === "string" && value.id !== "undefined") {
      return (
        <Link
          to={`${field.to}/${value.id}`}
          className="hover:text-blue-600 underline"
        >
          {isObject ? value.label : content}
        </Link>
      );
    } else {
      return isObject ? value.label : content;
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
          {isObject ? value.label : content}
        </Link>
      );
    }
  }

  return isObject ? value.label : content;
};

export default RenderCell;
