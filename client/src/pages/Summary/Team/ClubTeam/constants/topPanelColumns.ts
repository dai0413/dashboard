import { StatisticsColumn } from "../../../../../types/table";
import { TopPanelRows } from "../types";

export const columns: StatisticsColumn<TopPanelRows, TopPanelRows>[] = [
  {
    key: "competition",
    label: "大会",
    className: "max-w-[200px] truncate px-3 py-2.5 font-medium",
  },
  {
    key: "total",
    label: "試合",
    align: "right",
    className: "tabular-nums font-medium",
  },
  {
    key: "win",
    label: "勝",
    align: "right",
    className: "tabular-nums font-medium text-blue-500",
  },
  {
    key: "draw",
    label: "分",
    align: "right",
    className: "tabular-nums font-medium text-gray-500",
  },
  {
    key: "lose",
    label: "負",
    align: "right",
    className: "tabular-nums font-medium text-red-500",
  },
  {
    key: "winRate",
    label: "勝率",
    align: "right",
    className: "tabular-nums font-semibold text-blue-700",
  },
];
