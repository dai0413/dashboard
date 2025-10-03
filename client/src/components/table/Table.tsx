import { LinkField, TableHeader } from "../../types/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { isLabelObject, toDateKey } from "../../utils";
import { IconButton } from "../buttons";
import React, { useEffect, useMemo, useState } from "react";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    // 少ない場合は全部表示
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1); // 最初のページ

    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push("...");

    pages.push(total); // 最後のページ
  }

  return pages;
}

const RenderCell = (
  header: TableHeader,
  row: Record<string, any>,
  form: boolean,
  linkField?: LinkField[]
) => {
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

  if (!form && field) {
    let id = "";
    if (typeof value === "object" && "id" in value) {
      id = value.id;
    } else if ("_id" in row) id = row._id;

    return (
      <Link to={`${field.to}/${id}`} className="hover:text-blue-600 underline">
        {isObject ? value.label : content}
      </Link>
    );
  }

  return isObject ? value.label : content;
};

type TableDataProps<T> = {
  data: T[];
  headers: TableHeader[];
};

type TableLinkProps = {
  detailLink?: string | null; // 詳細リンク
  linkField?: LinkField[]; // ページ遷移
};

type TableUIProps = {
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  isLoading?: boolean;
  rowSpacing?: "wide" | "narrow";
};

/** テーブル編集関連のProps */
type TableEditProps<T> = {
  /** 単一データ編集モード */
  form?: boolean;
  onClick?: (row: T) => void;
  selectedKey?: string[];

  /** 複数データ編集モード */
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader,
    row: T,
    rowIndex: number
  ) => React.ReactNode;
  deleteOnClick?: (index: number) => void;
};

type TableProps<T> = TableLinkProps &
  TableUIProps &
  TableDataProps<T> &
  TableEditProps<T>;

const Table = <T extends Record<string, any>>({
  data = [],
  headers = [],
  linkField,
  detailLink = "",
  rowSpacing = "narrow",
  form = false,
  onClick = () => {},
  selectedKey = [],
  itemsPerPage,
  isLoading,
  currentPage,
  onPageChange,
  edit,
  renderFieldCell,
  deleteOnClick,
}: TableProps<T>) => {
  const location = useLocation();

  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => setPageNum(currentPage ? currentPage : 1), [currentPage]);

  const pageChange = useMemo(
    () => (onPageChange ? onPageChange : setPageNum),
    [onPageChange]
  );

  const totalPages = itemsPerPage ? Math.ceil(data.length / itemsPerPage) : 1;
  const paginatedData = itemsPerPage
    ? data.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage)
    : data;

  const pages = getPageNumbers(pageNum, totalPages);

  return (
    <div className="max-h-[50rem] overflow-y-auto">
      <table className="w-full table-fixed border">
        <thead className="sticky top-0 bg-gray-200 z-10">
          <tr className="bg-gray-200">
            {edit && (
              <th className="bg-gray-200 border" style={{ width: "35px" }}></th>
            )}
            {headers.map((header) => (
              <th
                scope="col"
                key={header.field}
                className="px-4 py-2 border"
                style={
                  header.width ? { width: header.width } : { width: "150px" }
                }
              >
                {header.label}
              </th>
            ))}
            {detailLink && (
              <th className="bg-gray-200 border" style={{ width: "80px" }}>
                詳細
              </th>
            )}
            {form && (
              <th className="bg-gray-200 border" style={{ width: "80px" }}>
                追加
              </th>
            )}
          </tr>
        </thead>
        {!isLoading && paginatedData.length == 0 && (
          <tbody>
            <tr>
              <td colSpan={headers.length}>
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <IconButton
                    icon="delete"
                    text="該当データはありません"
                    color="gray"
                    direction="vertical"
                    className="cursor-not-allowed"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        )}
        {isLoading && (
          <tbody aria-busy={isLoading}>
            {[...Array(itemsPerPage)].map((_, i) => (
              <tr key={i} className="animate-pulse border-t">
                {headers.map((_, j) => (
                  <td key={j} className="px-4 py-2 border">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                ))}
                {detailLink && (
                  <td className="px-4 py-2 border">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </td>
                )}
                {form && (
                  <td className="px-4 py-2 border">
                    <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        )}
        {!isLoading && paginatedData.length > 0 && (
          <tbody>
            {paginatedData.map((row, i) => (
              <tr key={i}>
                {edit && (
                  <th
                    className="border cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                    style={{ width: "35px" }}
                    onClick={() =>
                      deleteOnClick &&
                      deleteOnClick(
                        itemsPerPage ? (pageNum - 1) * itemsPerPage + i : i
                      )
                    }
                  >
                    <div className="flex justify-center items-center">
                      <XMarkIcon className="w-6 h-6" />
                    </div>
                  </th>
                )}
                {headers.map((header) => {
                  const value = header.getData
                    ? header.getData(row)
                    : row[header.field];

                  const title =
                    typeof value === "boolean"
                      ? value.toString()
                      : value instanceof Date
                      ? toDateKey(value)
                      : isLabelObject(value)
                      ? value.label
                      : value;

                  return (
                    <td
                      key={header.field}
                      className={`border px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap
                      ${rowSpacing === "wide" ? "h-16" : "h-8"} 
                      ${selectedKey.includes(row.key) ? "bg-blue-100" : ""}
                      ${
                        edit &&
                        typeof header.field === "string" &&
                        selectedKey.includes(header.field)
                          ? "border-2 border-blue-700"
                          : ""
                      }
                    `}
                      title={title}
                      style={{ width: "150px" }}
                    >
                      {edit
                        ? renderFieldCell &&
                          renderFieldCell(
                            header,
                            row,
                            itemsPerPage ? (pageNum - 1) * itemsPerPage + i : i
                          )
                        : RenderCell(header, row, form, linkField)}
                    </td>
                  );
                })}
                {detailLink && (
                  <td
                    className="cursor-pointer px-4 py-2 border overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ width: "80px" }}
                  >
                    <Link
                      to={`${detailLink}/${row._id}`}
                      className="underline hover:text-blue-600"
                      state={{
                        backgroundLocation: {
                          ...location,
                          pathname: location.pathname.replace(/\/$/, ""),
                        },
                      }}
                    >
                      詳細
                    </Link>
                  </td>
                )}
                {form && (
                  <td
                    className={`px-4 py-2 border ${
                      selectedKey.includes(row.key) ? "bg-blue-100" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                      onClick={() => onClick?.(row)}
                    >
                      <div className="flex justify-center items-center">
                        {selectedKey.includes(row.key) ? (
                          <XMarkIcon className="w-6 h-6" />
                        ) : (
                          <PlusCircleIcon className="w-6 h-6" />
                        )}
                      </div>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {pages.length > 1 && (
        <div className="flex justify-center m-4 space-x-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => pageChange(page)}
                className={`px-3 py-1 border rounded ${
                  pageNum === page ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Table;
