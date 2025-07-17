export type FilterOperator = "equals" | "contains" | "gte" | "lte";

// 共通の基本型
type BaseField = {
  key: string;
  label: string;
};

// フィルター用
type FilterField = {
  filterType: "string" | "number" | "Date" | "select";
  filterable?: boolean;
  value?: string | number | Date;
  operator?: FilterOperator;
  logic?: "AND" | "OR";
};

// ソート用
type SortField = {
  sortable: boolean;
  asc?: boolean | null;
};

// 詳細画面用
type DetailField = {
  displayOnDetail: boolean;
};

export type FilterableFieldDefinition = BaseField & FilterField;
export type SortableFieldDefinition = BaseField & SortField;

// 統合型（UIでよく使う）
export type FieldDefinition = BaseField &
  Partial<FilterField> &
  Partial<SortField> &
  Partial<DetailField>;
