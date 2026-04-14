import { ModelType } from "../models";
import { TableHeader } from "./base";

export type TableDataProps<T> = {
  modelType?: ModelType;
  data: T[];
  totalCount?: number;
  headers: TableHeader[];
  pageNation: "server" | "client";
};
