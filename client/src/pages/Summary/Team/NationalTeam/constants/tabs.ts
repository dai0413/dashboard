import { SummaryTabItems } from "../../../../../types/menu/IconButton";
import { NATIONAL_TEAM_TAB } from "../types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "series",
    key: NATIONAL_TEAM_TAB.SERIES,
    text: "シリーズ",
  },
  {
    icon: "match",
    key: NATIONAL_TEAM_TAB.MATCH,
    text: "試合",
  },
  {
    icon: "player",
    key: NATIONAL_TEAM_TAB.PLAYER,
    text: "選手",
  },
  {
    icon: "line-plot",
    key: NATIONAL_TEAM_TAB.PLAYER_PLOT,
    text: "選手推移",
  },
];
