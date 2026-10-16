import { ReactNode, useEffect, useMemo, useState } from "react";
import { DataViewContainer } from ".";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { applyFilterClient } from "../../utils/filter/applyFilterClient";
import { applySortClient } from "../../utils/sort/applySortClient";
import { Data, LinkField, ViewMode } from "../../types/types";
import { UIFieldDefinition } from "../../types/field";
import {
  QuickFilterData,
  QuickFilterType,
  TableHeader,
} from "../../types/table";
import { ModelType } from "../../types/models";
import { RadarField } from "../plot/RadarChart/types";
import { FormationItem } from "../../types/formation";
import { CalendarDataItem } from "./DataViewContent/DataView/Calendar/types";
import { RadarValues } from "../../utils/plot/buildRadarPlotData";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { MatchGet } from "../../types/models/match";
import { PlayerAppearanceGet } from "../../types/models/player-appearance";
import { FormationCounts } from "../../pages/Summary/Team/ClubTeam/types";
import { NationalCallup } from "../../types/models/national-callup";
import { NationalMatchSeries } from "../../types/models/national-match-series";
import { PlayerRegistrationGet } from "../../types/models/player-registration";
import { GroupedPlayers } from "./DataViewContent/DataView/Matrix/type";

const trimFilterKey = (
  fieldDefinitions: FilterableFieldDefinition[],
): FilterableFieldDefinition[] => {
  return fieldDefinitions.map((field) => ({
    ...field,
    key: field.key?.split(".")[0],
    filterKey: field.key?.split(".")[0],
  }));
};

const trimSortKey = (
  fieldDefinitions: SortableFieldDefinition[],
): SortableFieldDefinition[] => {
  return fieldDefinitions.map((field) => ({
    ...field,
    key: field.key?.split(".")[0],
    filterKey: field.key?.split(".")[0],
  }));
};

const defalut = {
  data: [],
  page: 1,
  totalCount: 0,
  isLoading: false,
};

type TableClientProps<T, F> = {
  totalCount: number;
  handlePageChange?: (
    page: number,
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
  handleFilterSort?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;

  title?: string;
  modelType?: ModelType;
  linkField?: LinkField[];
  pageNation?: "client" | "server";

  initialData?: {
    formData?: Partial<F>;
    metaData?: Record<string, any>;
  };

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

  filterField?: FilterableFieldDefinition[];
  sortField?: SortableFieldDefinition[];

  fieldDefinitions?: UIFieldDefinition<T>[];
  items?: T[];
  itemsLoading?: boolean;

  reloadFun?: (
    filterConditions: FilterableFieldDefinition[],
    sortConditions: SortableFieldDefinition[],
  ) => Promise<void>;
  quickFilterType?: QuickFilterType;
  quickFilterItems?: QuickFilterData[];
  noItemMessage?: ReactNode;
  noToolBar?: false;
  viewMode?: ViewMode.TABLE | ViewMode.TILE;
  newItemsPerPage?: number;
  newPageNum?: number;
  viewModes: ViewMode[];
  viewData: {
    [ViewMode.TABLE]?: T[];
    [ViewMode.TILE]?: T[];
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
  };
  defaultViewMode?: ViewMode;
};

const TableClient = <
  K extends Record<string, any>,
  F extends Record<string, any>,
>(
  props: TableClientProps<K, F>,
) => {
  const [viewOptionData, setViewOptionData] = useState<Data<any>>({
    data: props.viewData[ViewMode.TILE] || props.viewData[ViewMode.TABLE] || [],
    page: 1,
    totalCount:
      props.viewData[ViewMode.TILE]?.length ||
      props.viewData[ViewMode.TABLE]?.length ||
      0,
    isLoading: false,
  });

  const originalData = useMemo(
    () => props.viewData[ViewMode.TILE] || props.viewData[ViewMode.TABLE],
    [props.viewData[ViewMode.TILE], props.viewData[ViewMode.TABLE]],
  );

  useEffect(() => {
    if (!originalData) return;

    setViewOptionData({
      ...defalut,
      data: originalData,
      totalCount: props.totalCount,
    });
  }, [originalData]);

  const reloadFun = useMemo(
    () =>
      async (
        filterConditions: FilterableFieldDefinition[],
        sortConditions: SortableFieldDefinition[],
      ) => {
        const newFilterConditions = props.filterField
          ? props.filterField.filter((f) => !!f.value)
          : null;

        if (!props.reloadFun) return;
        if (newFilterConditions && newFilterConditions?.length > 0) {
          props.reloadFun(newFilterConditions, sortConditions);
        } else {
          props.reloadFun(filterConditions, sortConditions);
        }
      },
    [],
  );

  const handleFilterSort = useMemo(
    () =>
      async (
        filterConditions?: FilterableFieldDefinition[],
        sortConditions?: SortableFieldDefinition[],
      ): Promise<void> => {
        if (!originalData) return;

        setViewOptionData({ ...defalut, isLoading: true });

        let processed = [...originalData];

        processed = applyFilterClient(
          processed,
          "label",
          trimFilterKey(filterConditions || []),
        );
        processed = applySortClient(
          processed,
          "label",
          trimSortKey(sortConditions || []),
        );

        const nextViewOptionData = {
          data: processed,
          page: 1,
          totalCount: processed.length,
          isLoading: false,
        };

        setViewOptionData(nextViewOptionData);
      },
    [originalData],
  );

  return (
    <DataViewContainer
      {...{
        ...props,
        handleFilterSort: handleFilterSort,
        viewData: {
          ...props.viewData,
          [ViewMode.TILE]: viewOptionData.data,
          [ViewMode.TABLE]: viewOptionData.data,
        },
        totalCount: viewOptionData.totalCount,
        reloadFun: reloadFun,
        pageNation: "client",
      }}
    />
  );
};

export default TableClient;
