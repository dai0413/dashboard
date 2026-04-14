import { TableDataProps } from "./data";
import { TableEditProps } from "./edit";
import { TableLinkProps } from "./link";
import { TableUIProps } from "./ui";

export * from "./base";
export * from "./data";
export * from "./ui";
export * from "./link";
export * from "./edit";
export * from "./operation";
export * from "./quickFilter";

export type TableProps<T> = TableLinkProps &
  TableUIProps &
  TableDataProps<T> &
  TableEditProps<T>;
