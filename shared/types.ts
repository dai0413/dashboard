import { operator } from "./enum/operator.ts";

const operatorOptions = operator();
type FilterOperator = (typeof operatorOptions)[number]["key"];

export interface SendingFilter {
  field: string;
  operator: FilterOperator;
  value?: string | number | boolean | Date | string[];
  logic: "AND" | "OR";
}

// 共通の基本型
type BaseField = {
  key: string;
  label: string;
  type: "string" | "number" | "Date" | "select" | "checkbox" | "datetime-local";
};

// フィルター用
export type FilterField = {
  filterable?: boolean;
  value?: string | number | Date | boolean;
  operator?: FilterOperator;
  logic?: "AND" | "OR";
};

export type FilterableFieldDefinition = BaseField & FilterField;
