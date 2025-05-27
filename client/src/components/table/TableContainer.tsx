import { useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { TableHeader } from "../../types/types";
import { ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { TransferState } from "../../context/transfer-context";

type TableContainerProps = {
  title: string;
  headers: TableHeader[];
  contextState: TransferState;
  modelType?: ModelType | null;
};

const TableContainer = ({
  title,
  headers,
  contextState,
  modelType,
}: TableContainerProps) => {
  const { data: sortedData } = useSort();
  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("wide");

  const { items } = contextState;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter />
      <Sort data={items} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        modelType={modelType}
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
