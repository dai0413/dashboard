import {
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { FormTypeMap, ModelType } from "./models";
import { LinkField, TableHeader } from "./types";

export type TableBase<K extends ModelType> = {
  title?: string;
  headers: TableHeader[];
  modelType?: ModelType | null;
  formInitialData?: Partial<FormTypeMap[K]>;
  linkField?: LinkField[];
  pageNation?: "client" | "server";
};

export type TableFetch = {
  fetch: {
    apiRoute: string;
    params?: QueryParams;
  };
};

export type TableOperationFields = {
  filterField?: FilterableFieldDefinition[];
  sortField?: SortableFieldDefinition[];
  detailLinkValue?: string | null;
};

type TableDataProps<T> = {
  modelType?: ModelType;
  data: T[];
  totalCount?: number;
  headers: TableHeader[];
  pageNation: "server" | "client";
};

type TableLinkProps = {
  detailLink?: string | null; // 詳細リンク
  linkField?: LinkField[]; // ページ遷移
};

type TableUIProps = {
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?:
    | ((
        page: number,
        filterConditions: FilterableFieldDefinition[],
        sortConditions: SortableFieldDefinition[],
      ) => Promise<void>)
    | ((
        page: number,
        filterConditions: FilterableFieldDefinition[],
        sortConditions: SortableFieldDefinition[],
      ) => void);
  isLoading?: boolean;
};

/** テーブル編集関連のProps */
type TableEditProps<T> = {
  /** 単一データ編集モード */
  form?: boolean;
  onClick?: (row: T) => void;
  selectedKey?: string[];

  /** 複数データ編集モード */
  edit?: boolean;
  renderFieldCell?: (
    header: TableHeader,
    row: T,
    rowIndex: number,
  ) => React.ReactNode;
  deleteOnClick?: (index: number) => void;
};

export type TableProps<T> = TableLinkProps &
  TableUIProps &
  TableDataProps<T> &
  TableEditProps<T>;

export type QuickFilterItem = {
  key: string;
  label: string;
  filterCondition?: FilterableFieldDefinition;
  onClick?: (() => void) | (() => Promise<void>);
  defaultSelect?: boolean;
  removeKey?: string[];
};

export enum QuickFilterType {
  TEAM = "team",
  PLAYER_FOR_MATCH = "player-for-match",
  MATCH_EVENT_TYPE = "match-event-type",
  FORMATION = "formation",
}
