import { useEffect, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { TableHeader } from "../../types/types";
import { FormTypeMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { filterableFields } from "../../lib/filter-fields";
import { useFilter } from "../../context/filter-context";

type TableContainerProps<K extends keyof FormTypeMap> = {
  title: string;
  headers: TableHeader[];
  contextState: ModelContext<K>;
  modelType?: ModelType | null;
};

type FilterableField = {
  key: string;
  label: string;
  type: "string" | "number" | "Date" | "select";
  options?: string[];
};

const TableContainer = <K extends keyof FormTypeMap>({
  title,
  headers,
  contextState,
  modelType,
}: TableContainerProps<K>) => {
  const { data: sortedData, handleSort, sortConditions } = useSort();
  const { handleFilter, filterConditions } = useFilter();

  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("narrow");

  const { items, readItems, uploadFile, downloadFile } = contextState;

  useEffect(() => {
    readItems();
  }, []);

  const filterableField: FilterableField[] = modelType
    ? filterableFields[modelType]
    : [];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter filterableField={filterableField} />
      <Sort data={items} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        modelType={modelType}
        uploadFile={uploadFile}
        downloadFile={downloadFile}
      />
      <Table
        headers={headers}
        data={sortedData}
        detail={true}
        detailLink={modelType ? ModelRouteMap[modelType] : ""}
        rowSpacing={rowSpacing}
        itemsPerPage={10}
      />
    </div>
  );
};

export default TableContainer;
