import Table from "./Table";
import TableToolbar from "./TableToolbar";
import Filter from "./Filter";
import Sort from "./Sort";
import { TableHeader } from "../../types/types";
import { useFilter } from "../../context/filter-context";
import { useSort } from "../../context/sort-context";
import { useState } from "react";

interface TableContainerProps<T> {
  title: string;
  headers: TableHeader[];
  data: T[];
}

const TableContainer = <T extends Record<string, any>>({
  title,
  headers,
  data,
}: TableContainerProps<T>) => {
  const { filterOpen } = useFilter();
  const { sortOpen, data: sortedData } = useSort();
  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("wide");

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      {filterOpen && <Filter />}
      {sortOpen && <Sort data={data} />}
      <TableToolbar rowSpacing={rowSpacing} setRowSpacing={setRowSpacing} />
      <Table
        headers={headers}
        data={sortedData}
        detail={true}
        rowSpacing={rowSpacing}
      />
    </div>
  );
};

export default TableContainer;
