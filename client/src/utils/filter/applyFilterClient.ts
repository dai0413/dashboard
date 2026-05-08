import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { normalizeFilterValue, compareValue } from "../comparison";

export const applyFilterClient = <T extends Record<string, any>>(
  items: T[],
  filterConditions?: FilterableFieldDefinition[],
): T[] => {
  if (!filterConditions?.length) {
    return items;
  }

  return items.filter((item) => {
    return filterConditions.every((condition) => {
      if (!condition.filterable) {
        return true;
      }

      const key = condition.filterKey || condition.key;

      const rawItemValue = item[key];

      const itemValue = normalizeFilterValue(rawItemValue, condition.type);

      const values = condition.value || [];

      // is-empty / is-not-empty は value 不要
      if (
        condition.operator === "is-empty" ||
        condition.operator === "is-not-empty"
      ) {
        return compareValue(itemValue, undefined, condition.operator);
      }

      if (!values.length) {
        return true;
      }

      const logic = condition.logic || "OR";

      if (logic === "AND") {
        return values.every((value) =>
          compareValue(itemValue, value, condition.operator),
        );
      }

      return values.some((value) =>
        compareValue(itemValue, value, condition.operator),
      );
    });
  });
};
