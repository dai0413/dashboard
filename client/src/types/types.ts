export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export type ResponseStatus = {
  success: boolean | null;
  message?: string;
  errors?: Record<string, string[]>;
};

export type TableHeader = {
  label: string;
  field: string;
};

export type Label = {
  label: string;
  id: string;
};

export type FilterableField = {
  key: string;
  label: string;
  type: "string" | "number" | "Date" | "select";
};

export type FilterOperator = "equals" | "contains" | "gte" | "lte";
export type FilterCondition = FilterableField & {
  value: string | number | Date;
  operator: FilterOperator;
  logic?: "AND" | "OR";
};

export type SortCondition = FilterableField & {
  asc: boolean | null;
};
