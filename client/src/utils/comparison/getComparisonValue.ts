import { Comparison } from "../../types/comparison";
import { isLabelObject } from "../data/isLabelObject";

export const getComparisonValue = (value: any): Comparison => {
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
    return value.id;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return value;
};
