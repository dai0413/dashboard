import { ReactNode, useEffect, useMemo, useState } from "react";
import CustomTableContainer from "./CustomTableContainer";
import {
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { applyFilterClient } from "../../utils/filter/applyFilterClient";
import { applySortClient } from "../../utils/sort/applySortClient";
import { Data, LinkField, ViewMode } from "../../types/types";
import { UIFieldDefinition } from "../../types/field";
import {
  QuickFilterItem,
  QuickFilterType,
  TableData,
  TableHeader,
} from "../../types/table";
import { ModelType } from "../../types/models";

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
  modelType?: ModelType | null;
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
  quickFilterItems?: QuickFilterItem[];
  noItemMessage?: ReactNode;
  noToolBar?: false;
  viewMode?: ViewMode.TABLE | ViewMode.TILE;
  newItemsPerPage?: number;
  newPageNum?: number;
  renderView?: (params: {
    items: TableData<T>;
    totalCount: number;
    isLoading: boolean;
    filterConditions?: FilterableFieldDefinition[];
    sortConditions?: SortableFieldDefinition[];
  }) => React.ReactNode;
};

const TableClient = <
  K extends Record<string, any>,
  F extends Record<string, any>,
>(
  props: TableClientProps<K, F>,
) => {
  const [viewOptionData, setViewOptionData] = useState<Data<any>>(defalut);

  useEffect(() => {
    if (!props.items) return;
    setViewOptionData({
      ...defalut,
      data: props.items,
      totalCount: props.totalCount,
    });
  }, [props.items]);

  const reloadFun = useMemo(
    () =>
      async (
        _filterConditions: FilterableFieldDefinition[],
        _sortConditions: SortableFieldDefinition[],
      ) => {
        const newFilterConditions = props.filterField
          ? props.filterField.filter((f) => !!f.value)
          : null;

        if (!props.reloadFun || !newFilterConditions) return;
        props.reloadFun(newFilterConditions, []);
      },
    [props.reloadFun],
  );

  const handleFilterSort = useMemo(
    () =>
      async (
        filterConditions?: FilterableFieldDefinition[],
        sortConditions?: SortableFieldDefinition[],
      ): Promise<void> => {
        if (!props.items) return;

        setViewOptionData({ ...defalut, isLoading: true });

        let processed = [...props.items];

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
    [props.items],
  );

  console.log("viewOptionData", viewOptionData);

  return (
    <CustomTableContainer
      {...{
        ...props,
        handleFilterSort: handleFilterSort,
        items: viewOptionData.data,
        reloadFun: reloadFun,
        pageNation: "client",
      }}
    />
  );
};

export default TableClient;
