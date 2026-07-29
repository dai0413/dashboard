import { SummaryTabItems } from "../../../../../types/menu/IconButton";
import { CLUB_TEAM_TAB } from "../types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "player",
    key: CLUB_TEAM_TAB.PLAYER,
    text: "選手",
  },
  {
    icon: "future_in",
    key: CLUB_TEAM_TAB.FUTURE_IN,
    text: "内定",
  },
  {
    icon: "transfer_in",
    key: CLUB_TEAM_TAB.TRANSFER_IN,
    text: "加入",
  },
  {
    icon: "transfer_out",
    key: CLUB_TEAM_TAB.TRANSFER_OUT,
    text: "退団",
  },
  {
    icon: "loan",
    key: CLUB_TEAM_TAB.LOAN,
    text: "レンタル中",
  },
  {
    icon: "injury",
    key: CLUB_TEAM_TAB.INJURY,
    text: "怪我",
  },
  {
    icon: "match",
    key: CLUB_TEAM_TAB.MATCH,
    text: "試合",
  },
  {
    icon: "registration",
    key: CLUB_TEAM_TAB.PLAYER_REGISTRATION,
    text: "選手登録",
  },
  {
    icon: "registration",
    key: CLUB_TEAM_TAB.STAFF_REGISTRATION,
    text: "スタッフ登録",
  },
  {
    icon: "series",
    key: CLUB_TEAM_TAB.TEAM_COMPETITION_SEASON,
    text: "所属カテゴリ",
  },
  {
    icon: "line-plot",
    key: CLUB_TEAM_TAB.LINE_PLOT,
    text: "勝点推移",
  },
  {
    icon: "pie-plot_1",
    key: CLUB_TEAM_TAB.PIE_PLOT_ATTACK,
    text: "攻撃スタッツ",
  },
  {
    icon: "pie-plot_2",
    key: CLUB_TEAM_TAB.PIE_PLOT_DEFENCE,
    text: "守備スタッツ",
  },
  {
    icon: "setting",
    key: CLUB_TEAM_TAB.STATS_L,
    text: "スタッツ",
  },
];
