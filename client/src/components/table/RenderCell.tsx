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
    header.getValueType === ColumnType.FIELD &&
    "element" in row &&
    React.isValidElement(row.element)
  ) {
    if (row.key === header.field) return row.element;
  }

  const value =
    header.getValueType === ColumnType.CUSTOM
      ? header.getData(row)
      : row[header.field];

  const field =
    linkField && linkField.find((field) => field.field === header.key);

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

  /*
   * 配列の場合
   */
  if (!form && field && Array.isArray(value)) {
    return (
      <>
        {value.map((item, index) => {
          const id = hasId(item)
            ? item.id
            : hasObjectId(item)
              ? item._id
              : undefined;

          const itemDisplayValue: string =
            typeof item === "string"
              ? item
              : typeof item === "object" && item !== null
                ? String(
                    "name" in item
                      ? item.name
                      : "team" in item
                        ? item.team
                        : "label" in item
                          ? item.label
                          : displayValue,
                  )
                : String(item);

          return (
            <React.Fragment key={id ?? index}>
              {index > 0 && ", "}

              {id ? (
                <Link
                  to={`${field.to}/${id}`}
                  className="hover:text-blue-600 underline"
                >
                  {itemDisplayValue}
                </Link>
              ) : (
                itemDisplayValue
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  /*
   * オブジェクトで id を持つ場合
   */
  if (!form && field && hasId(value)) {
    return (
      <Link
        to={`${field.to}/${value.id}`}
        className="hover:text-blue-600 underline"
      >
        {displayValue}
      </Link>
    );
  }

  /*
   * オブジェクトで _id を持つ場合
   */
  if (!form && field && hasObjectId(value)) {
    return (
      <Link
        to={`${field.to}/${value._id}`}
        className="hover:text-blue-600 underline"
      >
        {displayValue}
      </Link>
    );
  }

  /*
   * row._id を使う場合
   */
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
