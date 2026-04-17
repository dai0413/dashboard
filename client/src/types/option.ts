import { TableHeader } from "./table";

export type OptionArray = Array<
  { key: string; label: string } & Record<string, any>
>;
export type OptionTable<T> = {
  header: TableHeader<T>[];
  data: T[];
};

export type ModelDataOptions<T> = {
  option: OptionTable<T>;
  page: number;
  totalCount: number;
};
