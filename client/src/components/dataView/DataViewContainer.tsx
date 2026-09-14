import { ReactNode, useCallback, useEffect, useMemo } from "react";

import DataViewToolBar from "./DataViewToolbar/DataViewToolBar";
import { Sort, Filter } from "../modals/index";

import {
  QuickFilterItem,
  QuickFilterType,
  TableData,
  TableHeader,
} from "../../types/table";

import { SortProvider, useSort } from "../../context/sort-context";
import { FilterProvider, useFilter } from "../../context/filter-context";
import { DataViewProvider, useDataView } from "../../context/dataView-context";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { isModelType, UIFieldDefinition } from "../../types/field";
import { fieldDefinition, getSortableFields } from "../../lib/model-fields";
import { toggleQuickFilter } from "../../utils/quickFilter/toggleQuickFilter";
import { LinkField, ViewMode } from "../../types/types";
import { downloadCsv } from "../../utils/data/downloadCsv";
import { getPageNumbers } from "../../utils/data/getPageNumbers";
import { ModelType } from "../../types/models";
import { AxiosResponse } from "axios";
import { DataViewContent } from "./DataViewContent/DataViewContent";
import { useQuickFilterSource } from "./DataViewToolbar/QuickFIlter/useQuickFilterSource";

type DataViewContainerProps<T, F> = {
  totalCount: number;
  handlePageChange?: (
    page: number,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
  title?: string;
  modelType?: ModelType;
  linkField?: LinkField[];
  pageNation?: "client" | "server";
  fieldDefinitions?: UIFieldDefinition<T>[];
  items?: T[];
  itemsLoading?: boolean;

  /** 単一データ編集モード */
  form?: boolean;
  onClick?: (index: number, row: T) => void;
  selectedKey?: string[];

  /** 複数データ編集モード */
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader<T>,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  deleteOnClick?: (index: number) => void;
  selectedKeys?: Record<number, string[]>;

  // ツールバー
  noToolBar?: false;
  reloadFun?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
  uploadFile?: (file: File) => Promise<AxiosResponse<any, any, {}> | undefined>;
  downloadFile?: () => Promise<boolean>;
  initialData?: {
    formData?: Partial<F>;
    metaData?: Record<string, any>;
  };
  handleFilterSort?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;

  // フィルター
  filterField?: FilterableFieldDefinition[];
  quickFilterType?: QuickFilterType;
  quickFilterItems?: QuickFilterItem[];

  // ソート
  sortField?: SortableFieldDefinition[];

  // dataview
  defaultViewMode?: ViewMode;
  viewModes?: ViewMode[];
  newItemsPerPage?: number;
  newPageNum?: number;

  // レンダリング
  noItemMessage?: ReactNode;
  renderView?: (params: {
    items: TableData<T>;
    totalCount: number;
    isLoading: boolean;
    filterConditions?: FilterableFieldDefinition[];
    sortConditions?: SortableFieldDefinition[];
  }) => React.ReactNode;
};

const Container = <K extends Record<string, unknown>, F>({
  title,
  fieldDefinitions = [],
  modelType,
  pageNation,
  initialData,
  linkField,
  items,
  itemsLoading,
  filterField = [],
  sortField = [],
  totalCount,
  handlePageChange,
  handleFilterSort,
  reloadFun,
  uploadFile,
  downloadFile,
  form,
  onClick,
  selectedKey,
  quickFilterType,
  quickFilterItems,
  noItemMessage,
  renderFieldCell,
  edit,
  noToolBar,
  defaultViewMode = ViewMode.TABLE,
  viewModes = [ViewMode.TABLE, ViewMode.TILE],
  newItemsPerPage,
  newPageNum,
  selectedKeys,
  deleteOnClick,
  renderView,
}: DataViewContainerProps<K, F>) => {
  const { sortConditions, closeSort, resetSort } = useSort();
  const { filterConditions, closeFilter, setFilterConditions } = useFilter();

  const {
    itemsPerPage,
    pageNum,
    setItemsPerPage,
    setColumnVisibility,
    setViewMode,
    setPageNum,
  } = useDataView();

  const datas = useMemo(() => {
    if (!items) return [];

    const offset =
      pageNation === "client" && itemsPerPage
        ? (pageNum - 1) * itemsPerPage
        : 0;

    const targetItems =
      pageNation === "client" && itemsPerPage
        ? items.slice(offset, offset + itemsPerPage)
        : items;

    return targetItems.map((item, index) => ({
      item,
      index: offset + index,
    }));
  }, [items, pageNation, itemsPerPage, pageNum]);

  const onPageChange = useCallback(
    async (
      page: number,
      filterConditions: FilterableFieldDefinition[],
      sortConditions: SortableFieldDefinition[],
    ) => {
      setPageNum(page);
      handlePageChange &&
        (await handlePageChange(page, filterConditions, sortConditions));
    },
    [handlePageChange, setPageNum],
  );

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

      setPageNum(1);
      closeFilter();

      if (handleFilterSort) {
        await handleFilterSort(paramFilterConditions, sortConditions);
      } else if (handlePageChange) {
        await handlePageChange(1, paramFilterConditions, sortConditions);
      }

      closeSort();
    },
    [
      filterField,
      setPageNum,
      closeFilter,
      handleFilterSort,
      handlePageChange,
      closeSort,
    ],
  );

  useEffect(() => {
    defaultViewMode &&
      viewModes.includes(defaultViewMode) &&
      setViewMode(defaultViewMode);
  }, [defaultViewMode]);

  useEffect(() => {
    newItemsPerPage && setItemsPerPage(newItemsPerPage);
  }, [newItemsPerPage]);

  useEffect(() => {
    newPageNum && setPageNum(newPageNum);
  }, [newPageNum]);

  useEffect(() => {
    const initialVisibility = fieldDefinitions?.reduce(
      (acc, h) => {
        acc[h.key] = h.displayOnTable ?? true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    initialVisibility && setColumnVisibility(initialVisibility);
  }, [fieldDefinitions]);

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
    if (!modelType || !isModelType(modelType)) return;
    const defs = fieldDefinition[modelType];
    if (!defs) return;

    const sortableField = getSortableFields(modelType);
    sortableField && resetSort(sortableField);
  }, [modelType]);

  // useEffect(() => {
  //   handleApplyFilter(filterConditions, sortConditions);
  // }, [updateTrigger]);

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

  const newDownloadFile = downloadFile
    ? downloadFile
    : async () => downloadCsv(`${modelType}.csv`, items ?? []);

  const pages = useMemo(() => {
    const totalPages =
      itemsPerPage && totalCount
        ? Math.max(Math.ceil(totalCount / itemsPerPage), 1)
        : itemsPerPage
          ? Math.ceil(datas.length / itemsPerPage)
          : 1;

    const pages = getPageNumbers(pageNum, totalPages);

    return pages;
  }, [itemsPerPage, totalCount, datas]);

  return (
    <div className="bg-white shadow-lg rounded-lg w-full mx-auto">
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      )}

      <Filter filterableField={filterField} onApply={handleApplyFilter} />
      <Sort sortableField={sortField} onApply={handleApplyFilter} />
      {noToolBar !== false && (
        <DataViewToolBar<K, F>
          modelType={modelType}
          downloadFile={newDownloadFile}
          uploadFile={uploadFile}
          initialData={initialData}
          reloadFun={reloadFun}
          quickFilterItems={quickFilterItemsParam}
          headers={fieldDefinitions}
          items={datas}
          viewModes={viewModes}
          enableFilter={filterField.length > 0}
          enableSort={sortField?.length > 0}
          enableField={fieldDefinitions?.length > 0}
        />
      )}

      <DataViewContent
        totalCount={totalCount}
        modelType={modelType}
        linkField={linkField}
        fieldDefinitions={fieldDefinitions}
        datas={datas}
        isLoading={itemsLoading || quickFilterLoading}
        form={form}
        onActionClick={onClick}
        selectedKey={selectedKey}
        edit={edit}
        renderFieldCell={renderFieldCell}
        deleteOnClick={deleteOnClick}
        selectedKeys={selectedKeys}
        noItemMessage={noItemMessage}
        renderView={renderView}
        pages={pages}
        pageNum={pageNum}
        onPageChange={(pageNum) => {
          onPageChange(pageNum, filterConditions, sortConditions);
        }}
      />
    </div>
  );
};

const DataViewContainer = <
  K extends Record<string, any>,
  F extends Record<string, any>,
>(
  props: DataViewContainerProps<K, F>,
) => {
  return (
    <FilterProvider>
      <SortProvider>
        <DataViewProvider>
          <Container {...props} />
        </DataViewProvider>
      </SortProvider>
    </FilterProvider>
  );
};

export default DataViewContainer;
