import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { IconButton } from "../buttons";
import RenderCell from "./RenderCell";
import { ColumnType, TableHeader } from "../../types/table";
import { toDisplayValue } from "../../utils/displayField/toDisplayValue";
import { LinkField, RowSpacing } from "../../types/types";

// type TableProps<T> = {
//   data: T[];
//   headers: TableHeader<T>[];
//   isLoading?: boolean;

//   onDetailClick?: (row: T) => void;
//   onActionClick?: (row: T, index: number) => void;
//   onDeleteClick?: (row: T, index: number) => void;
//   renderFieldCell?: (
//     header: TableHeader<T>,
//     row: T,
//     index: number,
//   ) => React.ReactNode;

//   selectedKey?: string[];
//   selectedKeys?: Record<number, string[]>;

//   form?: boolean;
//   edit?: boolean;
// };

const hasKey = (row: any): row is { key: string } => {
  return row && typeof row === "object" && "key" in row;
};

type NewTableProps<T> = {
  data: T[];
  headers: TableHeader<T>[];
  linkField?: LinkField[];
  pageNum: number;
  itemsPerPage: number | null;
  rowSpacing: RowSpacing;
  form?: boolean;
  selectedKey?: string[];
  selectedKeys?: Record<number, string[]>;
  isLoading?: boolean;
  edit?: boolean;

  renderFieldCell?: (
    header: TableHeader<T>,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  onActionClick?: (index: number, row: T) => void;
  onDetailClick?: (row: T) => void;
  onDeleteClick?: (index: number) => void;
};

const Table = <T,>({
  data,
  headers,
  linkField,
  itemsPerPage,
  pageNum,
  rowSpacing,
  form,
  selectedKey = [],
  selectedKeys,
  isLoading,
  edit,
  renderFieldCell,
  onActionClick,
  onDetailClick,
  onDeleteClick,
}: NewTableProps<T>) => {
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
              key={`${header.key}-${header.label}`}
              className="px-4 py-1 border"
              style={
                header.width
                  ? { width: header.width }
                  : { width: `${renderFieldCell ? "200px" : "150px"}` }
              }
            >
              {header.label}
            </th>
          ))}
          {onDetailClick && !form && (
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
      {!isLoading && data.length == 0 && (
        <tbody>
          <tr>
            <td colSpan={headers.length}>
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <IconButton
                  key=""
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
                <td key={j} className="px-4 py-1 border">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
              ))}
              {onDetailClick && !form && (
                <td className="px-4 py-1 border">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </td>
              )}
              {form && (
                <td className="px-4 py-1 border">
                  <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      )}
      {!isLoading && data.length > 0 && (
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {edit && (
                <th
                  className="border cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                  style={{ width: "35px" }}
                  onClick={() => {
                    console.log("delete", itemsPerPage, pageNum);
                    onDeleteClick &&
                      onDeleteClick(
                        itemsPerPage ? (pageNum - 1) * itemsPerPage + i : i,
                      );
                  }}
                >
                  <div className="flex justify-center items-center">
                    <XMarkIcon className="w-6 h-6" />
                  </div>
                </th>
              )}
              {headers.map((header) => {
                const { renderCellValue, title } = toDisplayValue(
                  header,
                  row,
                  linkField,
                );

                const dataIndex = itemsPerPage
                  ? (pageNum - 1) * itemsPerPage + i
                  : i;
                const textIsRed =
                  selectedKeys && selectedKeys[dataIndex]?.includes(header.key);
                const bgIsBlue = hasKey(row) && selectedKey.includes(row.key);

                return (
                  <td
                    key={`${header.key}-${header.label}`}
                    className={`border px-4 py-1 overflow-hidden text-ellipsis whitespace-nowrap
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
                    title={title}
                    style={{
                      width: `${renderFieldCell ? "200px" : "150px"}`,
                    }}
                  >
                    {form
                      ? title
                      : edit
                        ? renderFieldCell &&
                          renderFieldCell(header, row, dataIndex)
                        : RenderCell({ value: renderCellValue })}
                  </td>
                );
              })}
              {onDetailClick && !form && (
                <td
                  className={`px-4 py-1 border overflow-hidden text-ellipsis whitespace-nowrap ${
                    hasKey(row) && selectedKey.includes(row.key)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  style={{ width: "80px" }}
                >
                  <button
                    className="underline hover:text-blue-600 cursor-pointer"
                    onClick={() => onDetailClick(row)}
                  >
                    詳細
                  </button>
                </td>
              )}
              {form && (
                <td
                  className={`px-4 py-1 border ${
                    hasKey(row) && selectedKey.includes(row.key)
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => onActionClick?.(i, row)}
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
