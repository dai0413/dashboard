import { useEffect, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { TableHeader } from "../../types/types";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
  isFilterable,
  isSortable,
} from "../../types/field";
import { FormTypeMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { fieldDefinition } from "../../lib/model-fields";
import { useFilter } from "../../context/filter-context";
import { useForm } from "../../context/form-context";

type TableContainerProps<K extends keyof FormTypeMap> = {
  title: string;
  headers: TableHeader[];
  contextState: ModelContext<K>;
  modelType?: ModelType | null;
};

const TableContainer = <K extends keyof FormTypeMap>({
  title,
  headers,
  contextState,
  modelType,
}: TableContainerProps<K>) => {
  const { handleSort, closeSort } = useSort();
  const { handleFilter, closeFilter } = useFilter();
  const { isOpen } = useForm();

  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("narrow");

  const { items, readItems, uploadFile, downloadFile, isLoading } =
    contextState;

  const [tableData, setTableData] = useState<any[]>(items);

  const handleApplyFilter = () => {
    const filterd = handleFilter(items);
    const sorted = handleSort(filterd);
    setTableData(sorted);
    closeFilter();
    closeSort();
  };

  useEffect(() => {
    readItems();
  }, [isOpen]);

  useEffect(() => {
    setTableData(items);
  }, [items]);

  const filterableField = modelType
    ? (fieldDefinition[modelType].filter(
        isFilterable
      ) as FilterableFieldDefinition[])
    : [];

  const sortableField = modelType
    ? (fieldDefinition[modelType].filter(
        isSortable
      ) as SortableFieldDefinition[])
    : [];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Filter filterableField={filterableField} onApply={handleApplyFilter} />
      <Sort sortableField={sortableField} onApply={handleApplyFilter} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        modelType={modelType}
        uploadFile={uploadFile}
        downloadFile={downloadFile}
      />
      <Table
        headers={headers}
        data={tableData}
        detail={true}
        detailLink={modelType ? ModelRouteMap[modelType] : ""}
        rowSpacing={rowSpacing}
        itemsPerPage={10}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TableContainer;
