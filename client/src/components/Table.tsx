import { TableHeader } from "../types";

export type TableProps<T> = {
  data: T[];
  headers: TableHeader[];
};

const Table = <T extends Record<string, any>>({
  data,
  headers,
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
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            {headers.map((header) => (
              <td key={header.field} className="px-4 py-2 border">
                {row[header.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
