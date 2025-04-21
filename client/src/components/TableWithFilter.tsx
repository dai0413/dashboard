import Table from "./Table";
import Filter from "./Filter";
import { TableHeader } from "../types";
import { useState } from "react";

type TableWithFilterProps<T> = {
  headers: TableHeader[];
  data: T[];
  onFilterChange: (filter: string) => void;
};

const TableWithFilter = <T extends Record<string, any>>({
  headers,
  data,
  onFilterChange,
}: TableWithFilterProps<T>) => {
  const [filteropen, setFilterOpen] = useState<Boolean>(false);

  return (
    <>
      <div className="p-2 w-full">
        <button
          className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          onClick={() => setFilterOpen((prev) => !prev)}
        >
          フィルター
        </button>
      </div>
      {filteropen && <Filter onFilterChange={onFilterChange} />}
      <Table<T> headers={headers} data={data} />
    </>
  );
};

export default TableWithFilter;
