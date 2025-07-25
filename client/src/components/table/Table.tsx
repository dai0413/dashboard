import { useState } from "react";
import { TableHeader } from "../../types/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { isLabelObject } from "../../utils";
import { APP_ROUTES } from "../../lib/appRoutes";
import { IconButton } from "../buttons";

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

const renderCell = (header: TableHeader, row: Record<string, any>) => {
  const raw = row[header.field];
  const isObject = isLabelObject(raw);
  let content = raw;

  if (Array.isArray(raw)) {
    content = raw.join(", ");
  } else if (raw instanceof Date) {
    content = raw.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  if (header.field === "player" && isObject) {
    return (
      <Link
        to={`${APP_ROUTES.PLAYER_SUMMARY}/${raw.id}`}
        className="hover:text-blue-600 underline"
      >
        {raw.label}
      </Link>
    );
  }

  return isObject ? raw.label : content;
};

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
            {detail && <th className="bg-gray-200 border">詳細</th>}
            {form && <th className="bg-gray-200 border">追加</th>}
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
            ))}
          </tbody>
        )}
        {!isLoading && paginatedData.length > 0 && (
          <tbody>
            {paginatedData.map((row, i) => (
              <tr key={i}>
                {headers.map((header) => (
                  <td
                    key={header.field}
                    className={`border px-4 py-2 
                      ${
                        rowSpacing === "wide"
                          ? "h-16 whitespace-normal"
                          : "h-8 whitespace-nowrap"
                      } 
                      ${
                        selectedKey && row.key === selectedKey
                          ? "bg-blue-100"
                          : ""
                      }
                      overflow-hidden text-ellipsis max-w-[200px]
                      `}
                  >
                    {renderCell(header, row)}
                  </td>
                ))}
                {detail && (
                  <td className="cursor-pointer px-4 py-2 border overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                    <Link
                      to={`${detailLink}/${row._id}`}
                      className="underline hover:text-blue-600"
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
        )}
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
