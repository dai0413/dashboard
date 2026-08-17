import { SummaryTabItems } from "../../../../types/menu/IconButton";
import { PLAYER_TAB } from "../types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "setting",
    key: PLAYER_TAB.POSITION,
    text: "ポジション",
  },
  {
    icon: "transfer",
    key: PLAYER_TAB.TRANSFER,
    text: "移籍",
  },
  {
    icon: "injury",
    key: PLAYER_TAB.INJURY,
    text: "怪我",
  },
  {
    icon: "nationality",
    key: PLAYER_TAB.NATIONAL_CALLUP,
    text: "代表歴",
  },
  {
    icon: "registration",
    key: PLAYER_TAB.PLAYER_REGISTRATION,
    text: "選手登録",
  },
  {
    icon: "setting",
    key: PLAYER_TAB.STATISTICS,
    text: "統計",
  },
];
