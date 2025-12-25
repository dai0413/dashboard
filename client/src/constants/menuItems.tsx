import { APP_ROUTES } from "../lib/appRoutes";
import { IconButtonProps } from "../components/buttons/IconButton";
const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

export const BottomMenuItems: IconButtonProps[] = [
  {
    to: APP_ROUTES.TRANSFER,
    icon: "transfer",
    text: "移籍",
  },
  {
    to: APP_ROUTES.INJURY,
    icon: "injury",
    text: "怪我",
  },
  {
    to: APP_ROUTES.HOME,
    icon: "home",
    text: "ホーム",
  },
  {
    icon: "series",
    to: `${APP_ROUTES.NATIONAL_SUMMARY}/${japan}`,
    text: "日本",
  },
];

export const SPMenuItems: IconButtonProps[] = [
  {
    icon: "transfer",
    to: APP_ROUTES.TRANSFER,
    text: "移籍",
  },
  {
    icon: "injury",
    to: APP_ROUTES.INJURY,
    text: "怪我",
  },
  {
    icon: "series",
    to: `${APP_ROUTES.NATIONAL_SUMMARY}/${japan}`,
    text: "日本",
  },
  {
    icon: "my-page",
    to: APP_ROUTES.ME,
    text: "マイページ",
  },
  {
    icon: "setting",
    to: APP_ROUTES.ADMIN,
    text: "管理",
  },
];

export const PlayerTabItems: IconButtonProps[] = [
  {
    icon: "transfer",
    text: "移籍",
  },
  {
    icon: "injury",
    text: "怪我",
  },
  {
    icon: "nationality",
    text: "代表歴",
  },
  {
    icon: "registration",
    text: "選手登録",
  },
];

export const TeamTabItems: IconButtonProps[] = [
  {
    icon: "player",
    text: "選手",
  },
  {
    icon: "future_in",
    text: "内定",
  },
  {
    icon: "transfer_in",
    text: "加入",
  },
  {
    icon: "transfer_out",
    text: "退団",
  },
  {
    icon: "loan",
    text: "レンタル中",
  },
  {
    icon: "injury",
    text: "怪我",
  },
  {
    icon: "match",
    text: "試合",
  },
  {
    icon: "registration",
    text: "選手登録",
  },
  {
    icon: "line-plot",
    text: "勝点推移",
  },
];

export const NationalTabItems: IconButtonProps[] = [
  {
    icon: "competition",
    text: "大会",
  },
  {
    icon: "match",
    text: "代表試合",
    className: "cursor-not-allowed",
  },
  {
    icon: "series",
    text: "代表シリーズ",
  },
  {
    icon: "player",
    text: "代表招集選手",
  },
];

export const NationalMatchSeriesTabItems: IconButtonProps[] = [
  {
    icon: "match",
    text: "試合",
    className: "cursor-not-allowed",
  },
  {
    icon: "player",
    text: "招集選手",
  },
];

export const CompetitionTabItems: IconButtonProps[] = [
  {
    icon: "competitionStage",
    text: "ステージ",
  },
  {
    icon: "teamCompetitionSeason",
    text: "チーム",
  },
  {
    icon: "match",
    text: "試合",
  },
  {
    icon: "registration",
    text: "選手登録",
  },
];
