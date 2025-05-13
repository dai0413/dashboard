import { useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter, Form } from "../modals/index";

import { TableHeader } from "../../types/types";
import { useSort } from "../../context/sort-context";
import { TransferState } from "../../context/transfer-context";

type TableContainerProps = {
  title: string;
  headers: TableHeader[];
  contextHook: () => TransferState;
};

const TableContainer = ({
  title,
  headers,
  contextHook,
}: TableContainerProps) => {
  const { data: sortedData } = useSort();
  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("wide");
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const { transfers } = contextHook();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter />
      <Sort data={transfers} />
      <Form
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        contextHook={contextHook}
      />
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
