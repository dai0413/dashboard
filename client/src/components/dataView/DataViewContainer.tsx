import { ReactNode, useCallback, useEffect, useMemo } from "react";

import DataViewToolBar from "./DataViewToolbar/DataViewToolBar";
import { Sort, Filter, Field } from "../modals/index";

import {
  QuickFilterData,
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
import {
  ColumnVisibility,
  DisplayFields,
  isModelType,
  UIFieldDefinition,
} from "../../types/field";
import { getDataFields, getSortableFields } from "../../utils/data-field";
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
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { MatchGet } from "../../types/models/match";
import { PlayerAppearanceGet } from "../../types/models/player-appearance";
import { FormationCounts } from "../../pages/Summary/Team/ClubTeam/types";
import { NationalCallup } from "../../types/models/national-callup";
import { NationalMatchSeries } from "../../types/models/national-match-series";
import { PlayerRegistrationGet } from "../../types/models/player-registration";
import { GroupedPlayers } from "./DataViewContent/DataView/Matrix/type";
import { TransferGet } from "../../types/models/transfer";
import {
  MonthlyCalendarGroup,
  MonthleyCalendarHeaderItem,
} from "../../types/calendar";

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
  quickFilterItems?: QuickFilterData[];

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
    [ViewMode.MONTHLY_CALENDAR]?: {
      groups: MonthlyCalendarGroup[];
      headerItems: MonthleyCalendarHeaderItem[];
      selectedKey: string;
      headerOnChange: (key: string) => void;
    };
    [ViewMode.RADAR_CHART]?: {
      data: RadarValues;
      fields: RadarField[];
      label: string;
    };
    [ViewMode.FORMATION]?: FormationItem[];
    [ViewMode.POSITION_LIST]?: GroupedPlayers[];
    [ViewMode.CALENDAR]?: {
      data: CalendarDataItem[];
      currentDate: Date;
      setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    };
    [ViewMode.MATCH_MATRIX]?: {
      teamId: string;
      playerRegistrations: PlayerRegistrationGet[];
      matches: MatchGet[];
      playerAppearance: PlayerAppearanceGet[];
      groupedPlayers: GroupedPlayers[];
      defaultOpenPositions: Set<string>;
      topHeaderText: string;
    };
    [ViewMode.SERIES_MATRIX]?: {
      playerStatistics: PlayerStatistic[];
      nationalCallUp: NationalCallup[];
      nationalMatchSeries: NationalMatchSeries[];
      playerAppearance: PlayerAppearanceGet[];
      formationCounts: FormationCounts[];
      groupedPlayers: GroupedPlayers[];
      defaultOpenPositions: Set<string>;
      topHeaderText: string;
    };
    [ViewMode.BIRTH_YEAR_POSITION_MATRIX]?: {
      teamId: string;
      playerRegistrations: PlayerRegistrationGet[];
      matches: MatchGet[];
      playerAppearance: PlayerAppearanceGet[];
      groupedPlayers: GroupedPlayers[];
      defaultOpenPositions: Set<string>;
      topHeaderText: string;
      transferIns: TransferGet[];
      transferOuts: TransferGet[];
      baseDate?: Date;
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
    openFieldSetting,
    columnVisibility,
    setItemsPerPage,
    setColumnVisibility,
    setViewMode,
    setPageNum,
    setOpenFieldSetting,
  } = useDataView();

  const { datas, crudDatas } = useMemo(() => {
    const original = viewData[ViewMode.TILE] || viewData[ViewMode.TABLE];
    if (!original) return { datas: [], crudDatas: [] };

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

    const datas = targetItems.map((item, index) => ({
      item,
      index: offset + index,
    }));

    return { datas, crudDatas: original };
  }, [
    viewData,
    pageNation,
    itemsPerPage,
    newItemsPerPage,
    pageNum,
    newPageNum,
  ]);

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

  const fields: DisplayFields[] = useMemo(() => {
    if (columnVisibility) {
      return (
        fieldDefinitions
          ?.map((f) => {
            const visibility = columnVisibility[f.key];

            return {
              label: f.label,
              key: f.key,
              selecting: visibility.display,
              index: visibility.index,
            };
          })
          .sort((a, b) => {
            if (a.selecting && b.selecting) {
              return a.index - b.index;
            }

            return 0;
          }) || []
      );
    }

    return (
      fieldDefinitions?.map((f) => ({
        label: f.label,
        key: f.key,
        selecting: f.displayOnTable,
      })) || []
    );
  }, [columnVisibility, fieldDefinitions]);

  const initialVisibility: ColumnVisibility | undefined = useMemo(() => {
    const initialVisibility = fieldDefinitions?.reduce((acc, h, i) => {
      acc[h.key] = {
        display: h.displayOnTable ?? true,
        index: i,
      };
      return acc;
    }, {} as ColumnVisibility);

    return initialVisibility;
  }, [fieldDefinitions]);

  useEffect(() => {
    initialVisibility && setColumnVisibility(initialVisibility);
  }, [initialVisibility]);

  useEffect(() => {
    const filterConditions = filterField
      ? filterField.filter((f) => !!f.value)
      : null;

    if (filterConditions && filterConditions?.length) {
      setFilterConditions(filterConditions);
      handleApplyFilter(filterConditions, sortConditions);
    }
  }, [filterField]);

  useEffect(() => {
    if (!modelType || !isModelType(modelType)) return;
    const defs = getDataFields(modelType);
    if (!defs) return;

    const sortableField = getSortableFields(modelType);
    sortableField && resetSort(sortableField);
  }, [modelType]);

  const quickFilterSouce = useQuickFilterSource(quickFilterType);

  const quickFilterItemsParam: QuickFilterData[] = useMemo(() => {
    if (quickFilterItems && quickFilterItems.length > 0)
      return quickFilterItems;

    const { loading, ...rest } = quickFilterSouce;
    return [rest];
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

  const pageButton = useMemo(() => {
    const nextViewMode = defaultViewMode || viewMode;
    if (viewMode) {
      return viewMode === ViewMode.TABLE || viewMode === ViewMode.TILE;
    }
    return nextViewMode === ViewMode.TABLE || nextViewMode === ViewMode.TILE;
  }, [viewMode]);

  return (
    <div className="bg-white shadow-lg rounded-lg w-full mx-auto">
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      )}

      <Filter filterableField={filterField ?? []} onApply={handleApplyFilter} />
      <Sort sortableField={sortField ?? []} onApply={handleApplyFilter} />
      <Field
        fields={fields}
        isOpen={openFieldSetting}
        handleClose={() => setOpenFieldSetting(false)}
        handleReset={() => {
          initialVisibility && setColumnVisibility(initialVisibility);
        }}
        handleUpdate={(fields: DisplayFields[]) => {
          const newColumnVisibility: ColumnVisibility = {};

          fields.forEach((field, index) => {
            const value =
              typeof field.selecting === "boolean" ? field.selecting : false;
            newColumnVisibility[field.key] = { display: value, index };
          });

          setColumnVisibility(newColumnVisibility);
        }}
      />
      {noToolBar !== false && (
        <DataViewToolBar<K, F>
          modelType={modelType}
          downloadFile={newDownloadFile}
          uploadFile={uploadFile}
          initialData={initialData}
          reloadFun={reloadFun}
          quickFilterDatas={quickFilterItemsParam}
          headers={fieldDefinitions}
          crudDatas={crudDatas}
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
        isLoading={itemsLoading || quickFilterSouce.loading}
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
