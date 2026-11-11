import { SummaryTabItems } from "../../../../types/menu/IconButton";
import { COMPETITION_TAB } from "../types";

export const tabItems: SummaryTabItems[] = [
  {
    icon: "competitionStage",
    key: COMPETITION_TAB.COMPETITION_STAGE,
    text: "ステージ",
  },
  {
    icon: "teamCompetitionSeason",
    key: COMPETITION_TAB.TEAM_COMPETITION_SEASON,
    text: "チーム",
  },
  {
    icon: "match",
    key: COMPETITION_TAB.MATCH,
    text: "試合",
  },
  {
    icon: "registration",
    key: COMPETITION_TAB.PLAYER_REGISTRATION,
    text: "選手登録",
  },
  {
    icon: "staff",
    key: COMPETITION_TAB.STAFF_REGISTRATION,
    text: "スタッフ登録",
  },
  {
    icon: "teamCompetitionSeason",
    key: COMPETITION_TAB.SEASON,
    text: "シーズン",
  },
  {
    icon: "pie-plot_1",
    key: COMPETITION_TAB.STATS_L_ACTUAL,
    text: "スタッツ集計",
  },
  {
    icon: "setting",
    key: COMPETITION_TAB.STATS_L,
    text: "スタッツ履歴",
  },
  {
    icon: "setting",
    key: COMPETITION_TAB.PLAYER_STATISTICS,
    text: "選手統計",
  },
];
