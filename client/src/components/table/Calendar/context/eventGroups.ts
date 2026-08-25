import { ModelType } from "../../../../types/models";

export const eventGroups = [
  {
    key: ModelType.TRANSFER,
    label: "移籍",
    countLabel: "件",
  },
  {
    key: ModelType.INJURY,
    label: "怪我",
    countLabel: "件",
  },
  {
    key: ModelType.NATIONAL_MATCH_SERIES,
    label: "代表シリーズ",
    countLabel: "開始",
  },
  {
    key: ModelType.MATCH,
    label: "試合",
    countLabel: "試合",
  },
  {
    key: ModelType.PLAYER_REGISTRATION,
    label: "選手登録",
    countLabel: "件",
  },
  {
    key: ModelType.STAFF_REGISTRATION,
    label: "スタッフ登録",
    countLabel: "件",
  },
] satisfies {
  key: ModelType;
  label: string;
  countLabel: string;
}[];
