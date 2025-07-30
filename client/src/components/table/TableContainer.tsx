import { useEffect, useMemo, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { SummaryLinkField, TableHeader } from "../../types/types";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "../../types/field";
import { FormTypeMap, GettedModelDataMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { useFilter } from "../../context/filter-context";

type Base<K extends keyof FormTypeMap> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  summaryLinkField?: SummaryLinkField;
};

type Original<K extends keyof FormTypeMap> = Base<K> & {
  items: GettedModelDataMap[K][];
  itemsLoading?: boolean;
  originalFilterField?: FilterableFieldDefinition[];
  originalSortField?: SortableFieldDefinition[];
};

type ModelBase<K extends keyof FormTypeMap> = Base<K> & {
  contextState: ModelContext<K>;
};

type TableContainerProps<K extends keyof FormTypeMap> =
  | Original<K>
  | ModelBase<K>;

const TableContainer = <K extends keyof FormTypeMap>(
  props: TableContainerProps<K>
) => {
  const { handleSort, closeSort } = useSort();
  const { handleFilter, closeFilter } = useFilter();

  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("narrow");

  const tableItems = useMemo(() => {
    return "items" in props
      ? props.items
      : "contextState" in props
      ? props.contextState.items
      : [];
  }, [props]);

  const tableIsLoading = useMemo(() => {
    return "itemsLoading" in props
      ? props.itemsLoading
      : "contextState" in props
      ? props.contextState.isLoading
      : true;
  }, [props]);

  const filterField = useMemo(() => {
    return "originalFilterField" in props
      ? props.originalFilterField ?? []
      : "contextState" in props
      ? props.contextState.filterableField
      : [];
  }, [props]);

  const sortField = useMemo(() => {
    return "originalSortField" in props
      ? props.originalSortField ?? []
      : "contextState" in props
      ? props.contextState.sortableField
      : [];
  }, [props]);

  const [tableData, setTableData] = useState<any[]>(tableItems);

  const handleApplyFilter = () => {
    const filterd = handleFilter(tableItems);
    const sorted = handleSort(filterd);
    setTableData(sorted);
    closeFilter();
    closeSort();
  };

  useEffect(() => {
    setTableData(tableItems);
  }, [tableItems]);

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-7xl w-full mx-auto">
      {props.title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {props.title}
        </h2>
      )}

      <Filter filterableField={filterField} onApply={handleApplyFilter} />
      <Sort sortableField={sortField} onApply={handleApplyFilter} />
      <TableToolbar
        rowSpacing={rowSpacing}
        setRowSpacing={setRowSpacing}
        modelType={props.modelType}
        uploadFile={
          "contextState" in props ? props.contextState.uploadFile : undefined
        }
        downloadFile={
          "contextState" in props ? props.contextState.downloadFile : undefined
        }
        formInitialData={props.formInitialData}
      />
      <Table
        headers={props.headers}
        data={tableData}
        detail={true}
        detailLink={props.modelType ? ModelRouteMap[props.modelType] : ""}
        rowSpacing={rowSpacing}
        itemsPerPage={10}
        isLoading={tableIsLoading}
        summaryLinkField={props.summaryLinkField}
      />
    </div>
  );
};

export default TableContainer;
