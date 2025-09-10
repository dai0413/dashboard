import { OptionArray } from "../../../types/option";

export const operator = (): OptionArray => [
  { key: "equals", label: "と等しい" },
  { key: "not-equal", label: "と等しくない" },
  { key: "contains", label: "を含む" },
  { key: "gte", label: "以上" },
  { key: "lte", label: "以下" },
  { key: "greater", label: "より大きい" },
  { key: "less", label: "より小さい" },
  { key: "is-empty", label: "値なし" },
  { key: "is-not-empty", label: "値あり" },
];
