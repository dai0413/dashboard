import { useEffect, useMemo, useState } from "react";

import Table from "./Table";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { LinkField, TableHeader } from "../../types/types";

import { FormTypeMap, GettedModelDataMap, ModelType } from "../../types/models";

import { useSort } from "../../context/sort-context";
import { ModelRouteMap } from "../../types/models";
import { ModelContext } from "../../types/context";
import { useFilter } from "../../context/filter-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "../../../../shared/types";

type Base<K extends keyof FormTypeMap> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  linkField?: LinkField[];
};

type Original<K extends keyof FormTypeMap> = Base<K> & {
  items: GettedModelDataMap[K][];
  itemsLoading?: boolean;
  originalFilterField?: FilterableFieldDefinition[];
  originalSortField?: SortableFieldDefinition[];
  detailLink?: string | null;
  pageNum: number;
  handlePageChange: (page: number) => void;
  uploadFile?: (file: File) => Promise<boolean>;
  reloadFun?: () => Promise<void>;
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
  const [items, setItems] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

  useEffect(() => {
    const items =
      "items" in props
        ? props.items
        : "contextState" in props
        ? props.contextState.metacrud.items
        : [];
    setItems(items);
    setTableData(items);
  }, [
    updateTrigger,
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
    const filterd = handleFilter(items);
    const sorted = handleSort(filterd);
    setTableData(sorted);
    closeFilter();
    closeSort();

    if ("handlePageChange" in props && props.handlePageChange)
      props.handlePageChange(1);
  };

  const detailLink =
    "detailLink" in props
      ? props.detailLink
      : props.modelType
      ? ModelRouteMap[props.modelType]
      : "";

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
          "uploadFile" in props
            ? props.uploadFile
            : "contextState" in props
            ? props.contextState.metacrud.uploadFile
            : undefined
        }
        downloadFile={
          "contextState" in props
            ? props.contextState.metacrud.downloadFile
            : undefined
        }
        formInitialData={props.formInitialData}
        handleUpdateTrigger={() => {
          setUpdateTrigger((prev) => !prev);
        }}
        reloadFun={"reloadFun" in props ? props.reloadFun : undefined}
      />
      <Table
        pageNation="client"
        headers={props.headers}
        data={tableData}
        detailLink={detailLink}
        rowSpacing={rowSpacing}
        itemsPerPage={10}
        isLoading={tableIsLoading}
        linkField={props.linkField}
        currentPage={"pageNum" in props ? props.pageNum : 1}
        onPageChange={
          "handlePageChange" in props ? props.handlePageChange : undefined
        }
      />
    </div>
  );
};

export default TableContainer;
