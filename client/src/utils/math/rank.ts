export const rank = (values: number[], target: number): number => {
  const sorted = [...values].sort((a, b) => b - a);

  return sorted.filter((v) => v > target).length + 1;
};
