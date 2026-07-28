import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { compareValue } from "../comparison";

export const applyFilterClient = <T extends Record<string, any>>(
  items: T[],
  mode: "id" | "label",
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

      const values = !Array.isArray(condition.value)
        ? [condition.value]
        : condition.value || [];

      // is-empty / is-not-empty は value 不要
      if (
        condition.operator === "is-empty" ||
        condition.operator === "is-not-empty"
      ) {
        return compareValue(rawItemValue, undefined, mode, condition.operator);
      }

      if (!values.length) {
        return true;
      }

      const logic = condition.logic || "OR";

      if (logic === "AND") {
        return values.every((value) =>
          compareValue(rawItemValue, value, mode, condition.operator),
        );
      }

      return values.some((value) =>
        compareValue(rawItemValue, value, mode, condition.operator),
      );
    });
  });
};
