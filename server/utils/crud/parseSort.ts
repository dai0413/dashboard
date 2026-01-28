export const parseSort = (sortParam?: string) => {
  if (!sortParam) return {};

  const sortFields = sortParam.split(",").map((f) => f.trim());
  const sortObj: Record<string, 1 | -1> = {};

  for (const field of sortFields) {
    if (!field) continue;
    if (field.startsWith("-")) {
      sortObj[field.slice(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  }
  return sortObj;
};
