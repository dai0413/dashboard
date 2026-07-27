import { Icon } from "../../../types/menu/IconButton";
import { APP_ROUTES } from "../../../lib/appRoutes";

export const models: {
  model: string;
  desc: string;
  link: string;
  icon: Icon;
}[] = [
  {
    model: "Team",
    desc: "チーム",
    link: APP_ROUTES.TEAM,
    icon: "team",
  },
  {
    model: "Player",
    desc: "選手",
    link: APP_ROUTES.PLAYER,
    icon: "player",
  },
  {
    model: "Staff",
    desc: "監督・コーチ",
    link: APP_ROUTES.STAFF,
    icon: "player",
  },
  {
    model: "Competition",
    desc: "大会",
    link: APP_ROUTES.COMPETITION,
    icon: "competition",
  },
  {
    model: "CompetitionStage",
    desc: "大会ステージ",
    link: APP_ROUTES.COMPETITION_STAGE,
    icon: "competition",
  },
  {
    model: "Season",
    desc: "シーズン",
    link: APP_ROUTES.SEASON,
    icon: "competition",
  },
  {
    model: "Match",
    desc: "試合",
    link: APP_ROUTES.MATCH,
    icon: "match",
  },
  {
    model: "TeamCompetitionSeason",
    desc: "チームの大会参加記録",
    link: APP_ROUTES.TEAM_COMPETITION_SEASON,
    icon: "registration",
  },
  {
    model: "PlayerRegistration",
    desc: "選手登録情報",
    link: APP_ROUTES.PLAYER_REGISTRATION,
    icon: "registration",
  },
  {
    model: "PlayerRegistrationHistory",
    desc: "選手登録情報履歴",
    link: APP_ROUTES.PLAYER_REGISTRATION_HISTORY,
    icon: "registration",
  },
  {
    model: "StaffRegistration",
    desc: "スタッフ登録情報",
    link: APP_ROUTES.STAFF_REGISTRATION,
    icon: "registration",
  },
  {
    model: "StaffRegistrationHistory",
    desc: "スタッフ登録情報履歴",
    link: APP_ROUTES.STAFF_REGISTRATION_HISTORY,
    icon: "registration",
  },
  {
    model: "Referee",
    desc: "審判",
    link: APP_ROUTES.REFEREE,
    icon: "player",
  },
  {
    model: "Transfer",
    desc: "移籍",
    link: APP_ROUTES.TRANSFER,
    icon: "transfer",
  },
  {
    model: "Injury",
    desc: "怪我",
    link: APP_ROUTES.INJURY,
    icon: "injury",
  },
  {
    model: "Country",
    desc: "国",
    link: APP_ROUTES.COUNTRY,
    icon: "injury",
  },
  {
    model: "Formation",
    desc: "フォーメーション",
    link: APP_ROUTES.FORMATION,
    icon: "setting",
  },
  {
    model: "Stadium",
    desc: "スタジアム",
    link: APP_ROUTES.STADIUM,
    icon: "injury",
  },
  {
    model: "NationalMatchSeries",
    desc: "代表試合シリーズ",
    link: APP_ROUTES.NATIONAL_MATCH_SERIES,
    icon: "series",
  },
  {
    model: "NationalCallUp",
    desc: "代表招集リスト",
    link: APP_ROUTES.NATIONAL_CALLUP,
    icon: "callup",
  },
  {
    model: "MatchFormat",
    desc: "試合フォーマット",
    link: APP_ROUTES.MATCH_FORMAT,
    icon: "setting",
  },
  {
    model: "MatchEventType",
    desc: "試合イベント",
    link: APP_ROUTES.MATCH_EVENT_TYPE,
    icon: "setting",
  },
  {
    model: "PlayerAppearance",
    desc: "選手の出場履歴",
    link: APP_ROUTES.PLAYER_APPEARANCE,
    icon: "match",
  },
  {
    model: "StaffAppearance",
    desc: "スタッフの出場履歴",
    link: APP_ROUTES.STAFF_APPEARANCE,
    icon: "match",
  },
  {
    model: "PlayerMatchEventLog",
    desc: "選手の試合イベントログ",
    link: APP_ROUTES.PLAYER_MATCH_EVENT_LOG,
    icon: "match",
  },
  {
    model: "StaffMatchEventLog",
    desc: "スタッフの試合イベントログ",
    link: APP_ROUTES.STAFF_MATCH_EVENT_LOG,
    icon: "match",
  },
  {
    model: "TeamMatchFormation",
    desc: "試合でのフォーメーション",
    link: APP_ROUTES.TEAM_MATCH_FORMATION,
    icon: "setting",
  },
  {
    model: "StatsL",
    desc: "スタッツL",
    link: APP_ROUTES.STATS_L,
    icon: "match",
  },
  {
    model: "RefereeAppearance",
    desc: "審判の出場履歴",
    link: APP_ROUTES.REFEREE_APPEARANCE,
    icon: "match",
  },
];
