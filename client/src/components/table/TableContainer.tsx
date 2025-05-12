import { useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter, Form } from "../modals/index";

import { TableHeader } from "../../types/types";
import { useSort } from "../../context/sort-context";

type TableContainerProps<
  T extends Record<string, any>,
  E extends Record<string, any>
> = {
  title: string;
  headers: TableHeader[];
  data: T[];
  formData: E;
};

const TableContainer = <
  T extends Record<string, any>,
  E extends Record<string, any>
>({
  title,
  headers,
  data,
  formData,
}: TableContainerProps<T, E>) => {
  const { data: sortedData } = useSort();
  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("wide");
  const [formOpen, setFormOpen] = useState<boolean>(false);

  console.log("data in table container ", data.length, data);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter />
      <Sort data={data} />
      <Form formOpen={formOpen} setFormOpen={setFormOpen} formData={formData} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        setFormOpen={setFormOpen}
      />
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
