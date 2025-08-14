import { TableHeader } from "./types";

export type OptionArray = Array<
  { key: string; label: string } & Record<string, any>
>;
export type OptionTable = {
  header: TableHeader[];
  data: OptionArray;
};
