import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { isLabelObject } from "../../utils";
import { useEffect, useMemo, useState } from "react";
import { useListView } from "../../context/listView-context";
import RenderCell from "./RenderCell";
import { ColumnType, TableProps } from "../../types/table";
import { useModal } from "../../context/modal-context";

export const Tile = <T,>({
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
  // isLoading,
  // currentPage,
  edit,
  renderFieldCell,
  deleteOnClick,
}: TableProps<T>) => {
  const { pageNum, rowSpacing } = useListView();

  const {
    detail: { open },
  } = useModal();

  const primaryHeaders = headers.filter((h) => h.isPrimary);

  const fallbackPrimary =
    primaryHeaders.length > 0 ? primaryHeaders : headers.slice(0, 1);

  const secondaryHeaders = headers.filter((h) => !fallbackPrimary.includes(h));

  const [openKeys, setOpenKeys] = useState<(string | undefined)[]>([]);

  const toggleOpen = (key?: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const hasId = (row: any): row is { _id: string } => {
    return row && typeof row === "object" && "_id" in row;
  };

  const hasKey = (row: any): row is { key: string } => {
    return row && typeof row === "object" && "key" in row;
  };

  const getKey = (row: T): string => {
    if (hasKey(row)) return row.key;
    if (hasId(row)) return row._id;
    return "";
  };

  useEffect(() => {
    if (rowSpacing === "wide") {
      setOpenKeys(data.map((row) => getKey(row)));
    } else {
      setOpenKeys([]);
    }
  }, [rowSpacing, data]);

  const paginatedData = useMemo(() => {
    const targetData =
      pageNation === "client"
        ? itemsPerPage
          ? data.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage)
          : data
        : data;

    return targetData;
  }, [data, itemsPerPage, pageNum]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {paginatedData.map((row, index) => {
        const isSelected = selectedKey.includes(getKey(row));
        const isOpen = openKeys.includes(getKey(row));

        const isObject = typeof row === "object" && row !== null;

        return (
          <div
            key={getKey(row) ?? index}
            className={`relative border rounded-md p-3 shadow-sm
              ${
                isSelected ? "bg-blue-100 border-5 border-blue-300" : "bg-white"
              }
              ${
                form
                  ? "cursor-pointer hover:bg-blue-50 hover:border-blue-200"
                  : ""
              }
            `}
            onClick={form ? () => onClick?.(row) : undefined}
          >
            {/* edit（削除） */}
            {edit && (
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={() => deleteOnClick?.(index)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}

            {/* ヘッダー行（常に表示） */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                {fallbackPrimary.map((header) => {
                  return (
                    <div key={header.id} className="flex gap-2">
                      <span className="text-gray-500">{header.label}</span>
                      <span className="font-medium">
                        {isObject && RenderCell(header, row, form, linkField)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-start gap-3">
                {/* actions */}
                {(detailLink || form) && (
                  <div className="flex justify-start gap-3 text-sm">
                    {hasId(row) && row._id && (
                      <button
                        className="underline hover:text-blue-600 cursor-pointer"
                        onClick={() => {
                          modelType && open(modelType, row._id);
                        }}
                      >
                        詳細
                      </button>
                    )}
                  </div>
                )}

                {/* 展開アイコン */}
                {secondaryHeaders.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOpen(getKey(row));
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isOpen ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* 展開エリア */}
            {isOpen && (
              <div className="mt-3 space-y-1 border-t pt-2">
                {secondaryHeaders.map((header) => {
                  const value =
                    header.type === ColumnType.CUSTOM
                      ? header.getData(row)
                      : (row as any)[header.field];

                  const title =
                    typeof value === "boolean"
                      ? value.toString()
                      : value instanceof Date
                        ? toDateKey(value)
                        : isLabelObject(value)
                          ? value.label
                          : value;

                  return (
                    <div
                      key={header.id}
                      className="flex justify-between text-sm"
                      title={title}
                    >
                      <span className="text-gray-500">{header.label}</span>
                      <span className="font-medium text-right ml-2">
                        {edit
                          ? renderFieldCell &&
                            renderFieldCell(
                              header,
                              row,
                              itemsPerPage
                                ? (pageNum - 1) * itemsPerPage + index
                                : index,
                            )
                          : isObject &&
                            RenderCell(header, row, form, linkField)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Tile;
