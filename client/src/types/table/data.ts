import { ModelType } from "../models";
import { TableHeader } from "./base";

export type TableData<T> = { item: T; index: number }[];

export type TableDataProps<T> = {
  modelType?: ModelType;
  datas: TableData<T>;
  headers: TableHeader<T>[];
  totalCount?: number;
  pageNation: "server" | "client";
};
