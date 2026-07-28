import { FilterOperator } from "@dai0413/myorg-shared";
import { getComparisonValue } from "./getComparisonValue";
import { isComparableEqual } from "./isCompareableEqual";

export function compareValue(
  itemValue: any,
  conditionValue: any,
  mode: "id" | "label",
  operator?: FilterOperator,
): boolean {
  const item = getComparisonValue(itemValue, mode);
  const condition = getComparisonValue(conditionValue, mode);

  const itemValues = Array.isArray(item) ? item : [item];

  const conditionValues = Array.isArray(condition) ? condition : [condition];

  switch (operator) {
    case "equals":
      return itemValues.some((itemValue) =>
        conditionValues.some((conditionValue) =>
          isComparableEqual(itemValue, conditionValue),
        ),
      );

    case "not-equal":
      return !itemValues.some((itemValue) =>
        conditionValues.some((conditionValue) =>
          isComparableEqual(itemValue, conditionValue),
        ),
      );

    case "contains":
      return itemValues.some((itemValue) =>
        conditionValues.some((conditionValue) =>
          String(itemValue ?? "")
            .toLowerCase()
            .includes(String(conditionValue ?? "").toLowerCase()),
        ),
      );

    case "gte":
      return Number(item) >= Number(condition);

    case "lte":
      return Number(item) <= Number(condition);

    case "greater":
      return Number(item) > Number(condition);

    case "less":
      return Number(item) < Number(condition);

    case "is-empty":
      return item === undefined || item === null || item === "";

    case "is-not-empty":
      return !(item === undefined || item === null || item === "");

    default:
      return true;
  }
}
