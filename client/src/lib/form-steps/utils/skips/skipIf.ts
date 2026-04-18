export const skipIf =
  <T>(predicate: (values: Partial<T>) => boolean) =>
  (values: Partial<T>) =>
    predicate(values);
