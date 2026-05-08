import { SortableFieldDefinition } from "@dai0413/myorg-shared";
import { normalizeFilterValue, compareSortValue } from "../comparison";

export const applySortClient = <T extends Record<string, any>>(
  items: T[],
  sortConditions?: SortableFieldDefinition[],
): T[] => {
  if (!sortConditions?.length) {
    return items;
  }

  const activeSorts = sortConditions.filter(
    (condition) =>
      condition.sortable &&
      condition.asc !== undefined &&
      condition.asc !== null,
  );

  if (!activeSorts.length) {
    return items;
  }

  return [...items].sort((a, b) => {
    for (const condition of activeSorts) {
      const key = condition.key;

      const aValue = normalizeFilterValue(a[key], condition.type);

      const bValue = normalizeFilterValue(b[key], condition.type);

      const comparison = compareSortValue(aValue, bValue);

      if (comparison !== 0) {
        return condition.asc ? comparison : -comparison;
      }
    }

    return 0;
  });
};
