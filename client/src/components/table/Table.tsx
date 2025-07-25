import { useState } from "react";
import { TableHeader } from "../../types/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { isLabelObject } from "../../utils";
import { APP_ROUTES } from "../../lib/appRoutes";

export type TableProps<T> = {
  data: T[];
  headers: TableHeader[];
  detail?: boolean;
  detailLink?: string;
  rowSpacing?: "wide" | "narrow";
  form?: boolean;
  onClick?: (row: T) => void;
  selectedKey?: string;
  itemsPerPage?: number;
  isLoading?: boolean;
};

const Table = <T extends Record<string, any>>({
  data = [],
  headers = [],
  detail = false,
  detailLink = "",
  rowSpacing = "narrow",
  form = false,
  onClick = () => {},
  selectedKey = "",
  itemsPerPage,
  isLoading,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = itemsPerPage ? Math.ceil(data.length / itemsPerPage) : 1;
  const paginatedData = itemsPerPage
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;

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

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="max-h-[50rem] overflow-y-auto">
      <table className="min-w-full table-auto border">
        <thead className="sticky top-0 bg-gray-200 z-10">
          <tr className="bg-gray-200">
            {headers.map((header) => (
              <th scope="col" key={header.field} className="px-4 py-2 border">
                {header.label}
              </th>
            ))}
            {detail && <th className="bg-gray-200">詳細</th>}
            {form && <th className="bg-gray-200">追加</th>}
          </tr>
        </thead>
        <tbody aria-busy={isLoading}>
          {isLoading
            ? // 読み込み中のスケルトン行（5行分を仮で表示）
              [...Array(itemsPerPage)].map((_, i) => (
                <tr key={i} className="animate-pulse border-t">
                  {headers.map((_, j) => (
                    <td key={j} className="px-4 py-2 border">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                  {detail && (
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
              ))
            : paginatedData.map((row, i) => (
                <tr key={i} className="border-t">
                  {headers.map((header) => {
                    const cellContent = row[header.field];

                    let displayValue = cellContent;

                    const isObject = isLabelObject(cellContent);

                    if (Array.isArray(cellContent)) {
                      displayValue = cellContent.join(", ");
                    } else if (cellContent instanceof Date) {
                      displayValue = cellContent.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      });
                    }

                    if (header.field === "player")
                      return (
                        <td
                          key={header.field}
                          title={isObject ? cellContent.label : displayValue}
                          className={`border px-4 py-2 
                            ${rowSpacing === "wide" ? "h-16" : "h-8"} 
                            ${
                              selectedKey && row.key === selectedKey
                                ? "bg-blue-100"
                                : ""
                            }
                            overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]
                            hover:border-blue-500 hover:bg-blue-50 transition duration-150
                          `}
                        >
                          <Link
                            to={`${APP_ROUTES.PLAYER_SUMMARY}/${cellContent.id}`}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {isObject ? cellContent.label : displayValue}
                          </Link>
                        </td>
                      );

                    return (
                      <td
                        key={header.field}
                        title={isObject ? cellContent.label : displayValue}
                        className={`border px-4 py-2 
                      ${rowSpacing === "wide" ? "h-16" : "h-8"} 
                      ${
                        selectedKey && row.key === selectedKey
                          ? "bg-blue-100"
                          : ""
                      }
                      overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]
                      `}
                      >
                        {isObject ? cellContent.label : displayValue}
                      </td>
                    );
                  })}
                  {detail && (
                    <td className="cursor-pointer px-4 py-2 border overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                      <Link
                        to={`${detailLink}/${row._id}`}
                        className="text-blue-600 underline"
                      >
                        詳細
                      </Link>
                    </td>
                  )}
                  {form && (
                    <td
                      className={`px-4 py-2 border ${
                        selectedKey && row.key === selectedKey
                          ? "bg-blue-100"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="cursor-pointer  text-gray-500 hover:text-gray-700 text-2xl"
                        onClick={() => onClick?.(row)}
                      >
                        {selectedKey && row.key === selectedKey ? (
                          <XMarkIcon className="w-6 h-6" />
                        ) : (
                          <PlusCircleIcon className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
      {pages.length > 1 && (
        <div className="flex justify-center mt-2 space-x-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-blue-500 text-white" : "bg-white"
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
