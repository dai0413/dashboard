import { OptionArray } from "../../../types/option";

export const category = (): OptionArray => [
  { key: "league", label: "リーグ" },
  { key: "cup", label: "カップ" },
  { key: "po", label: "プレーオフ" },
  { key: "friendly", label: "親善試合" },
  { key: "qualification", label: "予選" },
];
