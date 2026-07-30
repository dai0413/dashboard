import { SummaryTabItems } from "../../../../types/menu/IconButton";
import { NATIONAL_MATCH_SERIES_TAB } from "../types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "match",
    key: NATIONAL_MATCH_SERIES_TAB.MATCH,
    text: "試合",
  },
  {
    icon: "player",
    key: NATIONAL_MATCH_SERIES_TAB.NATIONAL_CALLUP,
    text: "招集選手",
  },
];
