import { Link } from "react-router-dom";
import { LinkField } from "../../types/types";
import { ColumnType, TableHeader } from "../../types/table";
import React from "react";

type BaseRow = {
  key?: string;
  _id?: string;
};

const RenderCell = <T extends BaseRow>(
  displayValue: string,
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

  const field =
    linkField && linkField.find((field) => field.field === header.id);

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
          {displayValue}
        </Link>
      );
    } else {
      return displayValue;
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
          {displayValue}
        </Link>
      );
    }
  }

  return displayValue;
};

export default RenderCell;
