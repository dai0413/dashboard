import { ReactNode, useEffect } from "react";

import ListView from "./ListView";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { FormTypeMap, ModelType } from "../../types/models";
import { ModelRouteMap } from "../../types/models";
import { TableBase, TableOperationFields } from "../../types/table";

import { SortProvider, useSort } from "../../context/sort-context";
import { FilterProvider, useFilter } from "../../context/filter-context";
import { ListViewProvider, useListView } from "../../context/listView-context";
import { TableHeader } from "../../types/types";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { isModelType, isSortable } from "../../types/field";
import { fieldDefinition } from "../../lib/model-fields";

type TablePage = {
  pageNum: number;
  totalCount?: number;
  handlePageChange?: (
    page: number,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[]
  ) => Promise<void>;
};

type TableForm = {
  form?: boolean;
  onClick?: (row: any) => void;
  selectedKey?: string[];
};

type Original<K extends ModelType> = Omit<TableBase<K>, "headers"> &
  TableOperationFields &
  TablePage &
  TableForm & {
    headers?: TableHeader[];
    items?: any[];
    itemsLoading?: boolean;

    uploadFile?: (
      file: File
    ) => Promise<AxiosResponse<any, any, {}> | undefined>;
    reloadFun?: (
      filterConditions?: FilterableFieldDefinition[],
      sortConditions?: SortableFieldDefinition[]
    ) => Promise<void>;
    displayBadge?: boolean;
    noItemMessage?: ReactNode;
  };

type TableContainerProps<K extends keyof FormTypeMap> = Original<K>;

const TableContainer = <K extends keyof FormTypeMap>({
  title,
  headers,
  modelType,
  formInitialData,
  linkField,
  items,
  itemsLoading,
  filterField,
  sortField,
  detailLinkValue,
  pageNum,
  totalCount,
  handlePageChange,
  uploadFile,
  reloadFun,
  form,
  onClick,
  selectedKey,
  displayBadge,
  noItemMessage,
}: TableContainerProps<K>) => {
  const { sortConditions, closeSort, resetSort } = useSort();
  const { filterConditions, closeFilter } = useFilter();

  const { updateTrigger, itemsPerPage } = useListView();

  useEffect(() => {
    const sortableField =
      modelType && isModelType(modelType)
        ? fieldDefinition[modelType].filter(isSortable)
        : undefined;
    sortableField && resetSort(sortableField);
  }, [modelType]);

  useEffect(() => {
    handleApplyFilter();
  }, [updateTrigger]);

  const handleApplyFilter = async () => {
    closeFilter();
    handlePageChange &&
      (await handlePageChange(1, filterConditions, sortConditions));
    closeSort();
  };

  const detailLink = detailLinkValue
    ? detailLinkValue
    : modelType
    ? ModelRouteMap[modelType]
    : "";

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-7xl w-full mx-auto">
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      )}

      <Filter filterableField={filterField || []} onApply={handleApplyFilter} />
      <Sort sortableField={sortField || []} onApply={handleApplyFilter} />
      <TableToolbar
        modelType={modelType}
        uploadFile={uploadFile}
        formInitialData={formInitialData}
        reloadFun={reloadFun}
        displayBadge={displayBadge}
      />
      {itemsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-gray-50 px-8 py-10 text-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
          </div>
        </div>
      ) : items && items?.length > 0 && headers ? (
        <ListView
          data={items}
          totalCount={totalCount}
          headers={headers}
          pageNation="client"
          linkField={linkField}
          detailLink={detailLink}
          itemsPerPage={itemsPerPage || 10}
          isLoading={itemsLoading}
          currentPage={pageNum}
          form={form}
          onClick={onClick}
          selectedKey={selectedKey}
        />
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-8 py-10 text-center">
            <p className="mb-2 text-lg font-semibold text-gray-600">
              表示するデータがありません
            </p>
            {noItemMessage}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomTableContainer = <K extends keyof FormTypeMap>(
  props: TableContainerProps<K>
) => {
  return (
    <FilterProvider>
      <SortProvider>
        <ListViewProvider>
          <TableContainer {...props} />
        </ListViewProvider>
      </SortProvider>
    </FilterProvider>
  );
};

export default CustomTableContainer;
