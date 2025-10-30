import {
  BaseField,
  FilterableFieldDefinition,
  FilterField,
  SortableFieldDefinition,
  SortField,
} from "../../../shared/types";

// 詳細画面用
type DetailField = {
  displayOnDetail: boolean;
  getValue?: (data: any) => string;
};

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
