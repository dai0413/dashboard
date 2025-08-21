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

import { useQuery } from "../../context/query-context";

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
  const { page, setPage } = useQuery();

  const handlePageChange = (page: number) => {
    setPage("page", page);
  };

  const { handleSort, closeSort } = useSort();
  const { handleFilter, closeFilter } = useFilter();

  const [rowSpacing, setRowSpacing] = useState<"wide" | "narrow">("narrow");
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const items =
      "items" in props
        ? props.items
        : "contextState" in props
        ? props.contextState.metacrud.items
        : [];
    setTableData(items);
    setPage("page", 1);
  }, [
    "items" in props ? props.items : null,
    "contextState" in props ? props.contextState.metacrud.items : null,
  ]);

  let souceLoading: boolean = false;
  if ("itemsLoading" in props) {
    souceLoading = props.itemsLoading || false;
  } else if ("contextState" in props) {
    souceLoading = props.contextState.metacrud.isLoading;
  }
  const tableIsLoading = useMemo(() => souceLoading, [souceLoading]);

  let souceFilterField: FilterableFieldDefinition[] = [];
  if ("originalFilterField" in props) {
    souceFilterField = props.originalFilterField || [];
  } else if ("contextState" in props) {
    souceFilterField = props.contextState.metacrud.filterableField;
  }
  const filterField = useMemo(() => souceFilterField, [souceFilterField]);

  let souceSortField: SortableFieldDefinition[] = [];
  if ("originalSortField" in props) {
    souceSortField = props.originalSortField || [];
  } else if ("contextState" in props) {
    souceSortField = props.contextState.metacrud.sortableField;
  }
  const sortField = useMemo(() => souceSortField, [souceSortField]);

  const handleApplyFilter = () => {
    const filterd = handleFilter(tableData);
    const sorted = handleSort(filterd);
    setTableData(sorted);
    closeFilter();
    closeSort();
    setPage("page", 1);
  };

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
          "contextState" in props
            ? props.contextState.metacrud.uploadFile
            : undefined
        }
        downloadFile={
          "contextState" in props
            ? props.contextState.metacrud.downloadFile
            : undefined
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
        currentPage={page.page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TableContainer;
