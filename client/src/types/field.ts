import { BaseField, FilterField, SortField } from "@dai0413/myorg-shared";
import { OptionType } from "../utils/createOption/types/base";
import { ModelType } from "./models";
import { QuickFilterType, TableHeader } from "./table";

// 詳細画面用
export type DetailField = {
  displayOnDetail: boolean;
};

export type DetailFieldDefinition = BaseField & DetailField;

// 統合型（UIでよく使う）
export type UIFieldDefinition<T> = BaseField &
  TableHeader<T> &
  Partial<FilterField> &
  Partial<SortField> &
  Partial<DetailField>;

export function isFilterable<T>(
  f: UIFieldDefinition<T>,
): f is UIFieldDefinition<T> & FilterField {
  return f.filterable === true && f.type !== undefined;
}

export function isSortable<T>(
  f: UIFieldDefinition<T>,
): f is UIFieldDefinition<T> & SortField {
  return typeof f.sortable === "boolean" && f.sortable === true;
}

export function isDisplayOnDetail<T>(
  f: UIFieldDefinition<T>,
): f is UIFieldDefinition<T> & DetailField {
  return f.displayOnDetail === true;
}

export function isModelType(value: string): value is ModelType {
  return Object.values(ModelType).includes(value as ModelType);
}

export function isOptionType(value: string): value is OptionType {
  return Object.values(OptionType).includes(value as OptionType);
}

export function isQuickFilterType(value: string): value is QuickFilterType {
  return Object.values(QuickFilterType).includes(value as QuickFilterType);
}
