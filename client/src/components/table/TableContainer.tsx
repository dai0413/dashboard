import { useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter, Form } from "../modals/index";

import { TableHeader } from "../../types/types";
import { useSort } from "../../context/sort-context";
import { TransferState } from "../../context/transfer-context";
import { OptionsWrapper } from "../../context/options-provider";

type TableContainerProps = {
  title: string;
  headers: TableHeader[];
  contextState: TransferState;
};

const TableContainer = ({
  title,
  headers,
  contextState,
}: TableContainerProps) => {
  const { data: sortedData } = useSort();
  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("wide");
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const { transfers } = contextState;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter />
      <Sort data={transfers} />
      <OptionsWrapper>
        <Form
          formOpen={formOpen}
          setFormOpen={setFormOpen}
          contextState={contextState}
        />
      </OptionsWrapper>
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
