import { average } from "./average";

export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }

  const mean = average(values);

  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
};
