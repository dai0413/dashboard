import { BaseField, FilterField, SortField } from "@dai0413/myorg-shared";
import { GettedModelDataMap, ModelType } from "./models";
import { QuickFilterType, TableHeader } from "./table";
import { OptionSource } from "./form/option";
import { OptionType } from "../utils/createOption/types/preset";
import {
  CustomOptionMap,
  CustomOptionType,
} from "../utils/createOption/types/custom";

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

export type CombinedKey = ModelType | CustomOptionType;

export type FieldValueMap = { [K in ModelType]: GettedModelDataMap[K] } & {
  [K in CustomOptionType]: CustomOptionMap[K];
};

export function isModelType(value: unknown): value is ModelType {
  return Object.values(ModelType).includes(value as ModelType);
}

export function isOptionType(value: unknown): value is OptionType {
  return Object.values(OptionType).includes(value as OptionType);
}

export function isCustomOptionType(value: unknown): value is CustomOptionType {
  return Object.values(CustomOptionType).includes(value as CustomOptionType);
}

export function isQuickFilterType(value: string): value is QuickFilterType {
  return Object.values(QuickFilterType).includes(value as QuickFilterType);
}

export function resolveOptionSource(key: unknown): OptionSource | null {
  if (isOptionType(key)) return OptionSource.PRESET;
  if (isCustomOptionType(key)) return OptionSource.CUSTOM;
  if (isModelType(key)) return OptionSource.REMOTE;
  return null;
}

export type DisplayFields = Record<string, any> & {
  key: string;
  label: string;
  selecting: boolean;
  asc?: boolean | null;
};

export type ColumnVisibility = Record<
  string,
  {
    display: boolean;
    index: number;
  }
>;
