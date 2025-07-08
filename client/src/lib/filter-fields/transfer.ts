import { FilterableField } from "../../types/types";

export const transfer: FilterableField[] = [
  { key: "doa", label: "移籍発表日", type: "Date" },
  { key: "from_team", label: "移籍元", type: "string" },
  { key: "to_team", label: "移籍先", type: "string" },
  { key: "player", label: "選手", type: "string" },
  { key: "position", label: "ポジション", type: "select" },
  { key: "form", label: "フォーム", type: "select" },
  { key: "number", label: "背番号", type: "number" },
  { key: "from_date", label: "新チーム加入日", type: "Date" },
  { key: "to_date", label: "新チーム満了予定日", type: "Date" },
  //   { key: "URL", label: "URL", type: "string" },
];
