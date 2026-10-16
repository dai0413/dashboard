import { StatisticsColumn } from "../../../../types/table";
import { TopPanelRows } from "../types";

export const columns: StatisticsColumn<TopPanelRows, TopPanelRows>[] = [
  {
    key: "season",
    label: "シーズン",
    align: "right",
    className: "tabular-nums font-medium",
  },
  {
    key: "teams",
    label: "チーム",
    align: "right",
    className: "tabular-nums font-medium",
  },
  {
    key: "competition",
    label: "大会",
    className: "max-w-[200px] truncate px-3 py-2.5 font-medium",
  },
  {
    key: "starts",
    label: "スタメン",
    align: "right",
    className: "tabular-nums font-medium text-blue-500",
  },
  {
    key: "subs",
    label: "サブ",
    align: "right",
    className: "tabular-nums font-medium text-red-500",
  },
  {
    key: "bench",
    label: "ベンチ",
    align: "right",
    className: "tabular-nums font-medium text-gray-500",
  },
  {
    key: "goals",
    label: "ゴール",
    align: "right",
    className: "tabular-nums font-semibold text-blue-700",
  },
  {
    key: "assists",
    label: "アシスト",
    align: "right",
    className: "tabular-nums font-semibold text-blue-700",
  },
];
