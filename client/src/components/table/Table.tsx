import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { IconButton } from "../buttons";
import { useEffect, useMemo } from "react";
import { useListView } from "../../context/listView-context";
import RenderCell from "./RenderCell";
import { ColumnType, TableProps } from "../../types/table";
import { useModal } from "../../context/modal-context";
import { toDisplayValue } from "../../utils/displayField/toDisplayValue";

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
  selectedKeys,
  itemsPerPage,
  isLoading,
  currentPage,
  edit,
  renderFieldCell,
  deleteOnClick,
}: TableProps<T>) => {
  const { pageNum, rowSpacing, setPageNum, columnVisibility } = useListView();

  const {
    detail: { open },
  } = useModal();

  useEffect(() => setPageNum(currentPage ? currentPage : 1), [currentPage]);

  const visibleHeaders = useMemo(
    () => headers.filter((h) => columnVisibility[h.key]),
    [headers, columnVisibility],
  );

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
          {visibleHeaders.map((header) => (
            <th
              scope="col"
              key={`${header.key}-${header.label}`}
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
            <td colSpan={visibleHeaders.length}>
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
              {visibleHeaders.map((_, j) => (
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
              {visibleHeaders.map((header) => {
                const isObject = typeof row === "object" && row !== null;
                const displayValue = toDisplayValue(header, row);

                const dataIndex = itemsPerPage
                  ? (pageNum - 1) * itemsPerPage + i
                  : i;
                const textIsRed =
                  selectedKeys && selectedKeys[dataIndex]?.includes(header.key);
                const bgIsBlue = hasKey(row) && selectedKey.includes(row.key);

                return (
                  <td
                    key={`${header.key}-${header.label}`}
                    className={`border px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap
                      ${rowSpacing === "wide" ? "h-16" : "h-8"} 
                      ${bgIsBlue ? "bg-blue-100" : ""}
                      ${textIsRed ? "text-red-500 font-semibold" : ""}
                      ${
                        edit &&
                        header.getValueType === ColumnType.FIELD &&
                        selectedKey.includes(String(header.field))
                          ? "border-2 border-blue-700"
                          : ""
                      }

                    `}
                    title={displayValue}
                    style={{
                      width: `${renderFieldCell ? "200px" : "150px"}`,
                    }}
                  >
                    {edit
                      ? renderFieldCell &&
                        renderFieldCell(header, row, dataIndex)
                      : isObject &&
                        RenderCell(displayValue, header, row, form, linkField)}
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
                    onClick={() => onClick?.(i, row)}
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
