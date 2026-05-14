export type CardIdOption = {
  label: string;
  key: string;
  season?: string;
  competition?: string;
  match_week?: number;
  date?: Date;
  home_team: string;
  away_team: string;
  match_card_id?: string;
};

export enum CustomOptionType {
  CARD_IDS = "card_ids",
}

export type CustomOptionMap = {
  [CustomOptionType.CARD_IDS]: CardIdOption;
};
