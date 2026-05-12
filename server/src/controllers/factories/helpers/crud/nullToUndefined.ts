export const nullToUndefined = (obj: any): any => {
  if (obj === null) return undefined;
  if (Array.isArray(obj)) return obj.map(nullToUndefined);
  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, nullToUndefined(v)]),
    );
  }
  return obj;
};
