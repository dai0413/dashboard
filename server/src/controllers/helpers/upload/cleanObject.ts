export const cleanObject = <T extends Record<string, any>>(
  obj: T,
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== undefined && v !== null && v !== "",
    ),
  ) as Partial<T>;
