import Table from "./Table";
import Filter from "./Filter";
import { TableHeader } from "../../types/types";
import { useFilter } from "../../context/filter-context";

type TableWithFilterProps<T> = {
  headers: TableHeader[];
  data: T[];
};

const TableWithFilter = <T extends Record<string, any>>({
  headers,
  data,
}: TableWithFilterProps<T>) => {
  const { filterOpen, openFilter } = useFilter();

  return (
    <>
      {filterOpen && <Filter />}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={openFilter}
          className="text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition"
        >
          {filterOpen ? "Close Filter" : "Open Filter"}
        </button>
      </div>

      <Table headers={headers} data={data} detail={true} />
    </>
  );
};

export default TableWithFilter;
