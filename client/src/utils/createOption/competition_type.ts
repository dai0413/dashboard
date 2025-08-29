import { OptionArray } from "../../types/option";

export const competitionType = (): OptionArray => [
  { key: "club", label: "クラブ" },
  { key: "national", label: "国" },
  { key: "other", label: "その他" },
];
