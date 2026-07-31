import { SummaryTabItems } from "../../../../types/menu/IconButton";
import { MATCH_TAB } from "../types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "team",
    key: MATCH_TAB.HOME_STARTING_MEMBER,
    text: "ホームスタメン",
  },
  {
    icon: "team",
    key: MATCH_TAB.HOME_SUB_MEMBER,
    text: "ホームサブ",
  },
  {
    icon: "away",
    key: MATCH_TAB.AWAY_STARTING_MEMBER,
    text: "アウェイスタメン",
  },
  {
    icon: "away",
    key: MATCH_TAB.AWAY_SUB_MEMBER,
    text: "アウェイサブ",
  },
  {
    icon: "team",
    key: MATCH_TAB.STAFF_APPEARANCE,
    text: "スタッフ",
  },
  {
    icon: "player",
    key: MATCH_TAB.PLAYER_MATCH_EVENT_LOG,
    text: "選手イベント",
  },
  {
    icon: "staff",
    key: MATCH_TAB.STAFF_MATCH_EVENT_LOG,
    text: "監督イベント",
  },
  {
    icon: "setting",
    key: MATCH_TAB.TEAM_MATCH_FORMATION,
    text: "フォーメーション",
  },
  {
    icon: "setting",
    key: MATCH_TAB.HOME_STATS_L,
    text: "ホームスタッツ",
  },
  {
    icon: "setting",
    key: MATCH_TAB.AWAY_STATS_L,
    text: "アウェイスタッツ",
  },
  {
    icon: "player",
    key: MATCH_TAB.REFEREE_APPEARANCE,
    text: "審判",
  },
];
