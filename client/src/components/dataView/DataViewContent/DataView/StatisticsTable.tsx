import { Link } from "react-router-dom";
import {
  RenderCellValue,
  StatisticsColumn,
  StatisticsDatas,
} from "../../../../types/table";
import React from "react";

type StatisticsTableProps<
  T extends Record<string, StatisticsDatas>,
  F extends Record<string, StatisticsDatas> = T,
> = {
  columns: StatisticsColumn<T, F>[];
  rows: T[];
  footerRows?: F[];
};

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const StatisticsTable = <
  T extends Record<string, StatisticsDatas>,
  F extends Record<string, StatisticsDatas> = T,
>({
  columns,
  rows,
  footerRows,
}: StatisticsTableProps<T, F>) => {
  type CommonKey = keyof T & keyof F;

  const renderValue = (value: RenderCellValue) => {
    return value.to ? (
      <Link
        to={value.to}
        className="text-gray-800 hover:text-blue-600 hover:underline"
      >
        {value.label}
      </Link>
    ) : (
      value.label
    );
  };

  const renderValues = (value: RenderCellValue | RenderCellValue[]) => {
    const values = Array.isArray(value) ? value : [value];

    return (
      <div className="flex flex-wrap gap-2">
        {values.map((v, index) => (
          <React.Fragment key={index}>{renderValue(v)}</React.Fragment>
        ))}
      </div>
    );
  };

  const renderCells = (data: T | F) =>
    columns.map((column) => {
      const { value, className, align } = data[column.key as CommonKey];

      const textAlign = align ?? column.align ?? "left";

      return (
        <td
          key={String(column.key)}
          className={`px-3 py-2.5 ${
            alignClass[textAlign]
          } ${className ?? column.className ?? ""}`}
        >
          {renderValues(value)}
        </td>
      );
    });

  return (
    <table className="w-full whitespace-nowrap text-sm text-gray-700">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
          {columns.map((column) => (
            <th
              key={String(column.key)}
              className={`px-3 py-2.5 font-medium ${
                alignClass[column.align ?? "left"]
              } ${column.className ?? ""}`}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {rows.map((data, index) => (
          <tr key={index} className="transition-colors hover:bg-blue-50/40">
            {renderCells(data)}
          </tr>
        ))}
      </tbody>

      {footerRows && footerRows.length > 0 && (
        <tfoot>
          {footerRows.map((data, index) => (
            <tr
              key={index}
              className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-900"
            >
              {renderCells(data)}
            </tr>
          ))}
        </tfoot>
      )}
    </table>
  );
};
