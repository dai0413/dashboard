import { SummaryTabItems } from "../../../../types/menu/IconButton";
import { NATIONAL_TAB } from "../../National/types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "competition",
    key: NATIONAL_TAB.COMPETITION,
    text: "大会",
  },
  {
    icon: "team",
    key: NATIONAL_TAB.TEAM,
    text: "代表チーム",
  },
  {
    icon: "series",
    key: NATIONAL_TAB.NATIONAL_MATCH_SERIES,
    text: "シリーズ",
  },
];
