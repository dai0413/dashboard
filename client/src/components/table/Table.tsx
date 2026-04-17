import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { isLabelObject } from "../../utils";
import { IconButton } from "../buttons";
import { useEffect, useMemo } from "react";
import { useListView } from "../../context/listView-context";
import RenderCell from "./RenderCell";
import { ColumnType, TableProps } from "../../types/table";
import { useModal } from "../../context/modal-context";

const Table = <T,>({
  modelType,
  data = [],
  headers = [],
  pageNation = "client",
  linkField,
  detailLink = "",
  form = false,
  onClick = () => {},
  selectedKey = [],
  itemsPerPage,
  isLoading,
  currentPage,
  edit,
  renderFieldCell,
  deleteOnClick,
}: TableProps<T>) => {
  const { pageNum, rowSpacing, setPageNum } = useListView();

  const {
    detail: { open },
  } = useModal();

  useEffect(() => setPageNum(currentPage ? currentPage : 1), [currentPage]);

  const paginatedData = useMemo(() => {
    const targetData =
      pageNation === "client"
        ? itemsPerPage
          ? data.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage)
          : data
        : data;

    return targetData;
  }, [data, itemsPerPage, pageNum]);

  const hasId = (row: any): row is { _id: string } => {
    return row && typeof row === "object" && "_id" in row;
  };

  const hasKey = (row: any): row is { key: string } => {
    return row && typeof row === "object" && "key" in row;
  };

  return (
    <table className="w-full table-fixed border">
      <thead className="sticky top-0 bg-gray-200 z-10">
        <tr className="bg-gray-200">
          {edit && (
            <th className="bg-gray-200 border" style={{ width: "35px" }}></th>
          )}
          {headers.map((header) => (
            <th
              scope="col"
              key={header.id}
              className="px-4 py-2 border"
              style={
                header.width
                  ? { width: header.width }
                  : { width: `${renderFieldCell ? "200px" : "150px"}` }
              }
            >
              {header.label}
            </th>
          ))}
          {detailLink && !form && (
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
              {detailLink && !form && (
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
            <tr key={hasId(row) ? row._id : hasKey(row) ? row.key : i}>
              {edit && (
                <th
                  className="border cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                  style={{ width: "35px" }}
                  onClick={() =>
                    deleteOnClick &&
                    deleteOnClick(
                      itemsPerPage ? (pageNum - 1) * itemsPerPage + i : i,
                    )
                  }
                >
                  <div className="flex justify-center items-center">
                    <XMarkIcon className="w-6 h-6" />
                  </div>
                </th>
              )}
              {headers.map((header) => {
                const toTitleString = (value: unknown): string => {
                  if (typeof value === "undefined") return "";

                  if (value == null) return "";

                  if (typeof value === "string") return value;

                  if (typeof value === "boolean") return value.toString();

                  if (value instanceof Date) return toDateKey(value) || "";

                  if (isLabelObject(value)) return value.label;

                  return String(value);
                };

                const isObject = typeof row === "object" && row !== null;

                return (
                  <td
                    key={header.id}
                    className={`border px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap
                      ${rowSpacing === "wide" ? "h-16" : "h-8"} 
                      ${hasKey(row) && selectedKey.includes(row.key) ? "bg-blue-100" : ""}
                      ${
                        edit &&
                        header.type === ColumnType.FIELD &&
                        selectedKey.includes(String(header.field))
                          ? "border-2 border-blue-700"
                          : ""
                      }

                    `}
                    title={toTitleString(row)}
                    style={{
                      width: `${renderFieldCell ? "200px" : "150px"}`,
                    }}
                  >
                    {edit
                      ? renderFieldCell &&
                        renderFieldCell(
                          header,
                          row,
                          itemsPerPage ? (pageNum - 1) * itemsPerPage + i : i,
                        )
                      : isObject && RenderCell(header, row, form, linkField)}
                  </td>
                );
              })}
              {detailLink && !form && (
                <td
                  className={`px-4 py-2 border overflow-hidden text-ellipsis whitespace-nowrap ${
                    hasKey(row) && selectedKey.includes(row.key)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  style={{ width: "80px" }}
                >
                  <button
                    className="underline hover:text-blue-600 cursor-pointer"
                    onClick={() => {
                      modelType && hasId(row) && open(modelType, row._id);
                    }}
                  >
                    詳細
                  </button>
                </td>
              )}
              {form && (
                <td
                  className={`px-4 py-2 border ${
                    hasKey(row) && selectedKey.includes(row.key)
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => onClick?.(row)}
                  >
                    <div className="flex justify-center items-center">
                      {hasKey(row) && selectedKey.includes(row.key) ? (
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
  );
};

export default Table;
