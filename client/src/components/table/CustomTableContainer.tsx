import { ReactNode, useCallback, useEffect, useMemo } from "react";

import ListView from "./ListView";
import TableToolbar from "./TableToolbar";
import { Sort, Filter } from "../modals/index";

import { ModelRouteMap } from "../../types/models";
import {
  QuickFilterItem,
  QuickFilterType,
  TableBase,
  TableEditProps,
  TableHeader,
  TableOperationFields,
} from "../../types/table";

import { SortProvider, useSort } from "../../context/sort-context";
import { FilterProvider, useFilter } from "../../context/filter-context";
import { ListViewProvider, useListView } from "../../context/listView-context";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { isModelType, isSortable } from "../../types/field";
import { fieldDefinition } from "../../lib/model-fields";
import { toggleQuickFilter } from "../../utils/quickFilter/toggleQuickFilter";
import { useQuickFilterSource } from "./QuickFIlter/useQuickFilterSource";

type TablePage = {
  pageNum: number;
  totalCount?: number;
  handlePageChange?: (
    page: number,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
};

type TableForm = {
  form?: boolean;
  onClick?: (row: any) => void;
  selectedKey?: string[];
};

type Original<T, F> = Omit<TableBase<T, F>, "headers"> &
  TableOperationFields &
  TablePage &
  TableForm & {
    headers?: TableHeader<T>[];
    items?: T[];
    itemsLoading?: boolean;

    uploadFile?: (
      file: File,
    ) => Promise<AxiosResponse<any, any, {}> | undefined>;
    reloadFun?: (
      filterConditions: FilterableFieldDefinition[],
      sortConditions: SortableFieldDefinition[],
    ) => Promise<void>;
    quickFilterType?: QuickFilterType;
    quickFilterItems?: QuickFilterItem[];
    noItemMessage?: ReactNode;
  } & TableEditProps<T>;

type TableContainerProps<T, F> = Original<T, F>;

const TableContainer = <K, F>({
  title,
  headers,
  modelType,
  pageNation,
  initialData,
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
  quickFilterType,
  quickFilterItems,
  noItemMessage,
  renderFieldCell,
}: TableContainerProps<K, F>) => {
  const { sortConditions, closeSort, resetSort } = useSort();
  const { filterConditions, closeFilter, setFilterConditions } = useFilter();

  const { updateTrigger, itemsPerPage, setColumnVisibility } = useListView();

  const handleApplyFilter = useCallback(
    async (
      filterConditions: FilterableFieldDefinition[],
      sortConditions: SortableFieldDefinition[],
    ) => {
      const forceFilterConditions = filterField
        ? filterField.filter((f) => !!f.value)
        : null;

      const paramFilterConditions =
        forceFilterConditions && forceFilterConditions?.length > 0
          ? forceFilterConditions
          : filterConditions;

      closeFilter();

      if (handlePageChange) {
        await handlePageChange(1, paramFilterConditions, sortConditions);
      }

      closeSort();
    },
    [filterField],
  );

  useEffect(() => {
    const initialVisibility = headers?.reduce(
      (acc, h) => {
        acc[h.id] = h.defaultDisplay ?? true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    initialVisibility && setColumnVisibility(initialVisibility);
  }, [headers]);

  useEffect(() => {
    const filterConditions = filterField
      ? filterField.filter((f) => !!f.value)
      : null;
    filterConditions && setFilterConditions(filterConditions);

    filterConditions &&
      filterConditions?.length > 0 &&
      handleApplyFilter(filterConditions, sortConditions);
  }, [filterField]);

  useEffect(() => {
    const sortableField =
      modelType && isModelType(modelType)
        ? fieldDefinition[modelType].filter(isSortable)
        : undefined;
    sortableField && resetSort(sortableField);
  }, [modelType]);

  useEffect(() => {
    handleApplyFilter(filterConditions, sortConditions);
  }, [updateTrigger]);

  useEffect(() => {
    if (!quickFilterItems) return;

    const defaultItem = quickFilterItems.find((i) => i.defaultSelect);
    if (!defaultItem) return;

    const newFilterConditions =
      defaultItem.filterCondition &&
      toggleQuickFilter(defaultItem.filterCondition, filterConditions);
    if (!newFilterConditions) return;
    setFilterConditions(newFilterConditions);
    reloadFun && reloadFun(newFilterConditions, sortConditions);
    (async () => {
      await defaultItem.onClick?.();
    })();
  }, [quickFilterType, quickFilterItems]);

  const { items: quickFilterSouce, loading: quickFilterLoading } =
    useQuickFilterSource(quickFilterType);

  const quickFilterItemsParam = useMemo(() => {
    if (quickFilterItems && quickFilterItems.length > 0)
      return quickFilterItems;
    return quickFilterSouce ?? [];
  }, [quickFilterSouce, quickFilterItems]);

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
      <TableToolbar<K, F>
        modelType={modelType}
        uploadFile={uploadFile}
        initialData={initialData}
        reloadFun={reloadFun}
        quickFilterItems={quickFilterItemsParam}
        headers={headers}
      />
      {itemsLoading || quickFilterLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-gray-50 px-8 py-10 text-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
          </div>
        </div>
      ) : items && items?.length > 0 && headers ? (
        <ListView<K>
          modelType={modelType ? modelType : undefined}
          data={items}
          totalCount={totalCount}
          headers={headers}
          pageNation={pageNation ? pageNation : "client"}
          linkField={linkField}
          detailLink={detailLink}
          itemsPerPage={itemsPerPage || 10}
          isLoading={itemsLoading}
          currentPage={pageNum}
          onPageChange={handlePageChange}
          form={form}
          onClick={onClick}
          selectedKey={selectedKey}
          renderFieldCell={renderFieldCell}
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

const CustomTableContainer = <
  K extends Record<string, any>,
  F extends Record<string, any>,
>(
  props: TableContainerProps<K, F>,
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
