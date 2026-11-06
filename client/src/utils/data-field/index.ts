import { FilterField, SortField } from "@dai0413/myorg-shared";
import {
  CombinedKey,
  DetailField,
  FieldValueMap,
  UIFieldDefinition,
} from "../../types/field";
import { combinedFieldDefinition } from "../../lib/model-fields";

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

export function getSortableFields<K extends CombinedKey>(
  key: K,
): (UIFieldDefinition<FieldValueMap[K]> & SortField)[] {
  const defs = combinedFieldDefinition[key];
  if (!defs) return [];

  return defs.filter(isSortable);
}

export function getFilterableFields<K extends CombinedKey>(
  key: K,
): (UIFieldDefinition<FieldValueMap[K]> & FilterField)[] {
  const defs = combinedFieldDefinition[key];
  if (!defs) return [];

  return defs.filter(isFilterable);
}

export function getOnDetailFields<K extends CombinedKey>(
  key: K,
): (UIFieldDefinition<FieldValueMap[K]> & DetailField)[] {
  const defs = combinedFieldDefinition[key];
  if (!defs) return [];

  return defs.filter(isDisplayOnDetail);
}

export function getDataFields<K extends CombinedKey>(
  key: K,
): UIFieldDefinition<FieldValueMap[K]>[] {
  const defs = combinedFieldDefinition[key];
  if (!defs) return [];

  return defs;
}
