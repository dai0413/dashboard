import React from "react";
import { Label } from "@dai0413/myorg-shared";
import { displayPositions } from "../context/displayPositions";

type Dates = {
  start: Date;
  end: Date;
  label: string;
};

type MatrixTableProps<T extends Label> = {
  columns: T[];
  dates: Dates[];

  renderHeader: (column: T) => React.ReactNode;

  renderCell: (date: Dates, column: T, index: number) => React.ReactNode;
};

export const MatrixTable = <T extends Label>({
  columns,
  dates,
  renderHeader,
  renderCell,
}: MatrixTableProps<T>) => {
  return (
    <div className="max-h-[80vh] max-w-full overflow-auto rounded-md border border-gray-300">
      <table className="border-collapse">
        <thead>
          <tr>
            <th
              className="
                sticky top-0 left-0 z-40
                w-23 whitespace-nowrap
                border border-gray-300
                bg-white
              "
            >
              <div>生年・年齢</div>
            </th>

            {columns.map((column, i) => {
              const bgColor = `${displayPositions.find((p) => p.positions.includes(column.label) || p.key === column.label)?.color}`;

              const bgStyle = bgColor
                ? {
                    backgroundColor: `color-mix(in srgb, ${bgColor} 30%, white)`,
                  }
                : {};

              return (
                <th
                  key={column.id || i}
                  style={bgStyle}
                  className={`
                  sticky top-0 z-30
                  w-23
                  border border-gray-300
                  bg-white
                  p-1
                `}
                >
                  {renderHeader(column)}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {dates.map((date, index) => {
            const year = date.start.getFullYear();

            // 4年ごとのグループ番号（1997〜2000年を基準にする）
            const groupIndex = Math.floor((year - 1997) / 4);
            const isGray = Math.abs(groupIndex) % 2 === 0;

            return (
              <tr key={date.label}>
                <td
                  className={`
                        sticky left-0 z-10
                        w-23
                        whitespace-nowrap
                        border border-gray-300
                        px-5 py-0.5
                        font-semibold
                        ${isGray ? "bg-gray-200" : "bg-white"}
                      `}
                >
                  {`${date.start.getFullYear()}年`}

                  <span className="ml-1 text-sm text-gray-500">
                    {date.label}
                  </span>
                </td>

                {columns.map((column, i) => {
                  const bgColor = `${displayPositions.find((p) => p.positions.includes(column.label) || p.key === column.label)?.color}`;

                  const bgStyle = bgColor
                    ? {
                        backgroundColor: `color-mix(in srgb, ${bgColor} 10%, transparent)`,
                      }
                    : {};

                  return (
                    <td
                      key={column.id || i}
                      style={bgStyle}
                      className={`
                          border border-gray-300
                          w-23
                          ${isGray ? "bg-gray-200" : "bg-white"}
                        `}
                    >
                      {renderCell(date, column, index)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
