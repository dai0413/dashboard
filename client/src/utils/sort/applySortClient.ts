import { SortableFieldDefinition } from "@dai0413/myorg-shared";
import { compareSortValue } from "../comparison";

export const applySortClient = <T extends Record<string, any>>(
  items: T[],
  mode: "id" | "label",
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

      const comparison = compareSortValue(a[key], b[key], mode);

      if (comparison !== 0) {
        return condition.asc ? comparison : -comparison;
      }
    }

    return 0;
  });
};
