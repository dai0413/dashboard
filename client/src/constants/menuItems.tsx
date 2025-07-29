import { APP_ROUTES } from "../lib/appRoutes";
import { IconButtonProps } from "../components/buttons/IconButton";

export const BottomMenuItems: IconButtonProps[] = [
  {
    to: APP_ROUTES.HOME,
    icon: "home",
    text: "ホーム",
  },
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
    to: APP_ROUTES.ME,
    icon: "my-page",
    text: "マイページ",
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
    icon: "my-page",
    to: APP_ROUTES.INJURY,
    text: "マイページ",
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
    className: "cursor-not-allowed",
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
];
