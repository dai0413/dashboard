import { TableHeader } from "./types";

export type OptionArray = Array<
  { key: string; label: string } & Record<string, any>
>;
export type OptionTable = {
  header: TableHeader[];
  data: OptionArray;
};

export interface GetOptions {
  (key: string, table: true, filter?: boolean): OptionTable;
  (key: string, table?: false, filter?: boolean): OptionArray;
}
