import { OptionArray } from "../../types/option";

export const status = (): OptionArray => [
  { key: "joined", label: "参加" },
  { key: "declined", label: "事前辞退" },
  { key: "withdrawn", label: "途中離脱" },
];
