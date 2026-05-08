export const isEmptyObject = (obj: unknown): obj is Record<string, never> => {
  return (
    !!obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  );
};
