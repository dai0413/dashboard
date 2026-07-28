import { Comparison } from "../../types/comparison";
import { isLabelObject } from "../data/isLabelObject";

export const getComparisonValue = (
  value: any,
  mode: "id" | "label" = "id",
): Comparison => {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && isLabelObject(item)
        ? item.id
        : item instanceof Date
          ? item.getTime()
          : item,
    );
  }

  if (value && isLabelObject(value)) {
    if (mode === "id") {
      return value.id;
    }
    return value.label;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return value;
};
