import { ReactNode, useCallback, useEffect, useMemo } from "react";

import DataViewToolBar from "./DataViewToolbar/DataViewToolBar";
import { Sort, Filter } from "../modals/index";

import {
  QuickFilterItem,
  QuickFilterType,
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
import { RadarField } from "../plot/RadarChart/types";
import { FormationItem } from "../../types/formation";
import { CalendarDataItem } from "./DataViewContent/DataView/Calendar/types";
import { RadarValues } from "../../utils/plot/buildRadarPlotData";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { PlayerRegistrationHistoryGet } from "../../types/models/player-registration-history";
import { MatchGet } from "../../types/models/match";
import { PlayerAppearanceGet } from "../../types/models/player-appearance";
import { FormationCounts } from "../../pages/Summary/Team/ClubTeam/types";
import { NationalCallup } from "../../types/models/national-callup";
import { NationalMatchSeries } from "../../types/models/national-match-series";

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
  viewModes: ViewMode[];
  newItemsPerPage?: number;
  newPageNum?: number;

  // レンダリング
  noItemMessage?: ReactNode;

  viewData: {
    [ViewMode.TABLE]?: T[];
    [ViewMode.TILE]?: T[];
    [ViewMode.RADAR_CHART]?: {
      data: RadarValues;
      fields: RadarField[];
      label: string;
    };
    [ViewMode.FORMATION]?: FormationItem[];
    [ViewMode.CALENDAR]?: {
      data: CalendarDataItem[];
      currentDate: Date;
      setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    };
    [ViewMode.MATCH_MATRIX]?: {
      teamId: string;
      playerStatistics: PlayerStatistic[];
      playerRegistrations: PlayerRegistrationHistoryGet[];
      matches: MatchGet[];
      playerAppearance: PlayerAppearanceGet[];
      formationCounts: FormationCounts[];
    };
    [ViewMode.SERIES_MATRIX]?: {
      playerStatistics: PlayerStatistic[];
      nationalCallUp: NationalCallup[];
      nationalMatchSeries: NationalMatchSeries[];
      playerAppearance: PlayerAppearanceGet[];
      formationCounts: FormationCounts[];
    };
  };
};

const Container = <K extends Record<string, unknown>, F>({
  title,
  fieldDefinitions,
  modelType,
  pageNation,
  initialData,
  linkField,
  itemsLoading,
  filterField,
  sortField,
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
  viewData,
}: DataViewContainerProps<K, F>) => {
  const { sortConditions, closeSort, resetSort } = useSort();
  const { filterConditions, closeFilter, setFilterConditions } = useFilter();

  const {
    pageNum,
    itemsPerPage,
    viewMode,
    setItemsPerPage,
    setColumnVisibility,
    setViewMode,
    setPageNum,
  } = useDataView();

  const datas = useMemo(() => {
    const original = viewData[ViewMode.TILE] || viewData[ViewMode.TABLE];
    if (!original) return [];

    const nextItemsPerPage = newItemsPerPage || itemsPerPage;
    const nextPageNum = newPageNum || pageNum;

    const offset =
      pageNation === "client" && nextItemsPerPage
        ? ((nextPageNum || 1) - 1) * nextItemsPerPage
        : 0;

    const targetItems =
      pageNation === "client" && nextItemsPerPage
        ? original.slice(offset, offset + nextItemsPerPage)
        : original;

    return targetItems.map((item, index) => ({
      item,
      index: offset + index,
    }));
  }, [
    viewData,
    pageNation,
    itemsPerPage,
    newItemsPerPage,
    pageNum,
    newPageNum,
  ]);

  const { startBaseDate, endBaseDate } = useMemo(() => {
    let startBaseDate: Date | undefined;
    let endBaseDate: Date | undefined;

    filterConditions?.forEach((filterCondition) => {
      if (filterCondition.key === "joined_at" && filterCondition.value) {
        const value = filterCondition.value[0];

        if (typeof value !== "boolean") {
          startBaseDate = new Date(value);
        }
      }

      if (filterCondition.key === "left_at" && filterCondition.value) {
        const value = filterCondition.value[0];

        if (typeof value !== "boolean") {
          endBaseDate = new Date(value);
        }
      }
    });

    return {
      startBaseDate,
      endBaseDate,
    };
  }, [filterConditions]);

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
  }, []);

  useEffect(() => {
    if (!modelType || !isModelType(modelType)) return;
    const defs = fieldDefinition[modelType];
    if (!defs) return;

    const sortableField = getSortableFields(modelType);
    sortableField && resetSort(sortableField);
  }, [modelType]);

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
  }, []);

  const { items: quickFilterSouce, loading: quickFilterLoading } =
    useQuickFilterSource(quickFilterType);

  const quickFilterItemsParam = useMemo(() => {
    if (quickFilterItems && quickFilterItems.length > 0)
      return quickFilterItems;
    return quickFilterSouce ?? [];
  }, [quickFilterSouce, quickFilterItems]);

  const newDownloadFile = downloadFile
    ? downloadFile
    : async () =>
        downloadCsv(
          `${modelType}.csv`,
          (viewData[ViewMode.TABLE] || viewData[ViewMode.TILE]) ?? [],
        );

  const pages = useMemo(() => {
    const nextItemsPerPage = newItemsPerPage || itemsPerPage;
    const nextPageNum = newPageNum || pageNum;

    const totalPages =
      nextItemsPerPage && totalCount
        ? Math.max(Math.ceil(totalCount / nextItemsPerPage), 1)
        : nextItemsPerPage
          ? Math.ceil(datas.length / nextItemsPerPage)
          : 1;

    const pages = getPageNumbers(nextPageNum || 1, totalPages);

    return pages;
  }, [newItemsPerPage, itemsPerPage, newPageNum, pageNum, totalCount, datas]);

  const noItem = useMemo(() => {
    const nextViewMode = defaultViewMode || viewMode;

    const returnVal =
      (nextViewMode === ViewMode.TABLE && !viewData[ViewMode.TABLE]) ||
      viewData[ViewMode.TABLE]?.length === 0 ||
      (nextViewMode === ViewMode.TILE && !viewData[ViewMode.TILE]) ||
      viewData[ViewMode.TILE]?.length === 0;

    return returnVal;
  }, [viewMode, viewData]);

  const pageButton = useMemo(() => {
    const nextViewMode = defaultViewMode || viewMode;
    return nextViewMode === ViewMode.TABLE || nextViewMode === ViewMode.TILE;
  }, [viewMode]);

  return (
    <div className="bg-white shadow-lg rounded-lg w-full mx-auto">
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      )}

      <Filter filterableField={filterField ?? []} onApply={handleApplyFilter} />
      <Sort sortableField={sortField ?? []} onApply={handleApplyFilter} />
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
          enableFilter={filterField && filterField.length > 0}
          enableSort={sortField && sortField?.length > 0}
          enableField={fieldDefinitions && fieldDefinitions?.length > 0}
        />
      )}

      <DataViewContent
        modelType={modelType}
        linkField={linkField}
        fieldDefinitions={fieldDefinitions}
        noItem={noItem}
        isLoading={itemsLoading || quickFilterLoading}
        form={form}
        onActionClick={onClick}
        selectedKey={selectedKey}
        edit={edit}
        renderFieldCell={renderFieldCell}
        deleteOnClick={deleteOnClick}
        selectedKeys={selectedKeys}
        noItemMessage={noItemMessage}
        pageButton={pageButton}
        pages={pages}
        pageNum={newPageNum || pageNum || 1}
        onPageChange={(pageNum) => {
          onPageChange(pageNum, filterConditions, sortConditions);
        }}
        viewData={{
          ...viewData,
          [ViewMode.TILE]: datas,
          [ViewMode.TABLE]: datas,
          [ViewMode.SERIES_MATRIX]:
            viewData && viewData[ViewMode.SERIES_MATRIX]
              ? {
                  ...viewData[ViewMode.SERIES_MATRIX],
                  startBaseDate,
                  endBaseDate,
                }
              : undefined,
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
