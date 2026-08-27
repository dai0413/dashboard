import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { useListView } from "../../context/listView-context";
import RenderCell from "./RenderCell";
import { TableProps } from "../../types/table";
import { useModal } from "../../context/modal-context";
import { toDisplayValue } from "../../utils/displayField/toDisplayValue";
import { convertToDisplayListData } from "../modals/Detail/utils/convertToDisplayListData ";

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
  const { pageNum, rowSpacing, columnVisibility } = useListView();

  const {
    detail: { open },
  } = useModal();

  const visibleHeaders = useMemo(
    () => headers.filter((h) => columnVisibility[h.key]),
    [headers, columnVisibility],
  );
  const primaryHeaders = visibleHeaders.filter((h) => h.isPrimary);

  const fallbackPrimary =
    primaryHeaders.length > 0 ? primaryHeaders : visibleHeaders.slice(0, 1);

  const secondaryHeaders = visibleHeaders.filter(
    (h) => !fallbackPrimary.includes(h),
  );

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
            onClick={form ? () => onClick?.(index, row) : undefined}
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
                  const { renderCellValue, title } = toDisplayValue(
                    header,
                    row,
                    linkField,
                  );

                  return (
                    <div key={header.key} className="flex gap-2">
                      <span className="text-gray-500">{header.label}</span>
                      <span className="font-medium">
                        {form ? title : RenderCell({ value: renderCellValue })}
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
                          modelType &&
                            open(
                              modelType,
                              row._id,
                              convertToDisplayListData({
                                data: row,
                                model: {
                                  modelType,
                                  linkField: linkField || [],
                                },
                              }),
                            );
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
                  const { renderCellValue, title } = toDisplayValue(
                    header,
                    row,
                    linkField,
                  );

                  return (
                    <div
                      key={header.key}
                      className="flex justify-between text-sm"
                      title={title}
                    >
                      <span className="text-gray-500">{header.label}</span>
                      <span className="font-medium text-right ml-2">
                        {form
                          ? title
                          : edit
                            ? renderFieldCell &&
                              renderFieldCell(
                                header,
                                row,
                                itemsPerPage
                                  ? (pageNum - 1) * itemsPerPage + index
                                  : index,
                              )
                            : RenderCell({ value: renderCellValue })}
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
