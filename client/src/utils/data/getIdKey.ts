export const hasId = (row: any): row is { _id: string } => {
  return row && typeof row === "object" && "_id" in row;
};

export const hasKey = (row: any): row is { key: string } => {
  return row && typeof row === "object" && "key" in row;
};

export const getIdKey = <T>(row: T): string => {
  if (hasKey(row)) return row.key;
  if (hasId(row)) return row._id;
  return "";
};
