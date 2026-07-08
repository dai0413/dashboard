export const rank = (
  values: number[],
  target: number,
  higherIsBetter = true,
): number => {
  const better = higherIsBetter
    ? values.filter((v) => v > target)
    : values.filter((v) => v < target);

  return better.length + 1;
};
