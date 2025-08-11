import { operatorOptions } from "../context/options-provider";

export type FilterOperator = (typeof operatorOptions)[number]["key"];

// 共通の基本型
type BaseField = {
  key: string;
  label: string;
  type: "string" | "number" | "Date" | "select" | "checkbox";
};

// フィルター用
type FilterField = {
  filterable?: boolean;
  value?: string | number | Date;
  operator?: FilterOperator;
  logic?: "AND" | "OR";
};

// ソート用
type SortField = {
  sortable: boolean;
  asc?: boolean | null;
};

// 詳細画面用
type DetailField = {
  displayOnDetail: boolean;
};

export type FilterableFieldDefinition = BaseField & FilterField;
export type SortableFieldDefinition = BaseField & SortField;
export type DetailFieldDefinition = BaseField & DetailField;

// 統合型（UIでよく使う）
export type FieldDefinition = BaseField &
  Partial<FilterField> &
  Partial<SortField> &
  Partial<DetailField>;

export function isFilterable(
  f: FieldDefinition
): f is FilterableFieldDefinition {
  return f.filterable === true && f.type !== undefined;
}

export function isSortable(f: FieldDefinition): f is SortableFieldDefinition {
  return f.sortable === true;
}

export function isDisplayOnDetail(
  f: FieldDefinition
): f is DetailFieldDefinition {
  return f.displayOnDetail === true;
}
