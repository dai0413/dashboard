import { OptionArray } from "../../types/option";

export const stageType = (): OptionArray => [
  { key: "none", label: "なし" },
  { key: "group_stage", label: "グループステージ" },
  { key: "round", label: "ラウンド" },
  { key: "quarter_final", label: "準々決勝" },
  { key: "semi_final", label: "準決勝" },
  { key: "final", label: "決勝" },
  { key: "other", label: "その他" },
];
