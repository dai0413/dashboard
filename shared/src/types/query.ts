// --- 比較演算子をサポートする値型 ---
export type QueryValue =
  | string
  | number
  | boolean
  | Date
  | `${">" | "<" | ">=" | "<=" | "!=" | "="}${string | number}`
  | Array<string | number | boolean | Date>
  | "exists"
  | "not_exists";

// --- クエリパラメータの型 ---
export type QueryParams = Record<string, QueryValue> & {
  filters?: string;
  sorts?: string;
  getAll?: boolean;
};
