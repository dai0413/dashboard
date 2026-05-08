import { getComparisonValue } from "./getComparisonValue";

export function compareSortValue(a: any, b: any): number {
  const normalizedA = getComparisonValue(a);
  const normalizedB = getComparisonValue(b);

  // nullish は後ろ
  if (normalizedA == null && normalizedB == null) {
    return 0;
  }

  if (normalizedA == null) {
    return 1;
  }

  if (normalizedB == null) {
    return -1;
  }

  // array の場合は先頭比較
  const aValue = Array.isArray(normalizedA) ? normalizedA[0] : normalizedA;

  const bValue = Array.isArray(normalizedB) ? normalizedB[0] : normalizedB;

  if (aValue < bValue) {
    return -1;
  }

  if (aValue > bValue) {
    return 1;
  }

  return 0;
}
