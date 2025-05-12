import { TableHeader } from "../../types/types";

export type TableProps<T> = {
  data: T[];
  headers: TableHeader[];
  detail?: boolean;
  rowSpacing: "wide" | "narrow";
};

const Table = <T extends Record<string, any>>({
  data = [],
  headers = [],
  detail = false,
  rowSpacing,
}: TableProps<T>) => {
  return (
    <table className="min-w-full table-auto border">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((header) => (
            <th key={header.field} className="px-4 py-2 border">
              {header.label}
            </th>
          ))}
          {detail && <th className="bg-gray-200">詳細</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            {headers.map((header) => {
              const cellContent = row[header.field];

              const isObject =
                typeof cellContent === "object" && cellContent !== null;

              return (
                <td
                  key={header.field}
                  className={`${
                    rowSpacing === "wide" ? "h-16" : "h-8"
                  } px-4 py-2 border`}
                >
                  {cellContent instanceof Date ? (
                    cellContent.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  ) : isObject ? (
                    <a href={cellContent._id}>{cellContent.label}</a>
                  ) : (
                    cellContent
                  )}
                </td>
              );
            })}
            {detail && (
              <td className="px-4 py-2 border">
                <a href={`/transfer/${row._id}`}>詳細</a>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
