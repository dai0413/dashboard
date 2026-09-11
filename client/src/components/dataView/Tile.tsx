import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import RenderCell from "./RenderCell";
import { toDisplayValue } from "../../utils/displayField/toDisplayValue";
import { NewTableProps } from "./Table";
import { getIdKey, hasKey } from "../../utils/data/getIdKey";

export const Tile = <T,>({
  datas,
  headers,
  linkField,
  rowSpacing,
  form,
  selectedKey = [],
  // selectedKeys,
  edit,
  renderFieldCell,
  onActionClick,
  onDetailClick,
  onDeleteClick,
}: NewTableProps<T>) => {
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

  useEffect(() => {
    if (rowSpacing === "wide") {
      setOpenKeys(datas.map((row) => getIdKey(row.item)));
    } else {
      setOpenKeys([]);
    }
  }, [rowSpacing, datas]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {datas.map((data, index) => {
        const isSelected = selectedKey.includes(getIdKey(data.item));
        const isOpen = openKeys.includes(getIdKey(data.item));

        return (
          <div
            key={getIdKey(data.item) ?? index}
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
            onClick={form ? () => onActionClick?.(index, data.item) : undefined}
          >
            {/* edit（削除） */}
            {edit && (
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={() => onDeleteClick?.(index)}
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
                    data.item,
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
                {onDetailClick && !form && (
                  <div
                    className={`flex justify-start gap-3 text-sm ${
                      hasKey(data.item) && selectedKey.includes(data.item.key)
                        ? "bg-blue-100"
                        : ""
                    }`}
                  >
                    <button
                      className="underline hover:text-blue-600 cursor-pointer"
                      onClick={() => onDetailClick(data.item)}
                    >
                      詳細
                    </button>
                  </div>
                )}

                {/* 展開アイコン */}
                {secondaryHeaders.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOpen(getIdKey(data.item));
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
                    data.item,
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
                              renderFieldCell(header, data.item, data.index)
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
