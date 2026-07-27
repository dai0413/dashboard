export type MenuItems = {
  icon?: Icon;
  key: string;
  text?: string;
  to?: string;
};

export type SummaryTabItems = {
  icon?: Icon;
  key: string;
  text?: string;
  "cursor-not-allowed"?: boolean;
};

export type Icon =
  | "add"
  | "delete"
  | "edit"
  | "arrow-up"
  | "arrow-down"
  | "home"
  | "my-page"
  | "transfer"
  | "injury"
  | "nationality"
  | "player"
  | "transfer_in"
  | "transfer_out"
  | "future_in"
  | "loan"
  | "series"
  | "match"
  | "tournament"
  | "team"
  | "callup"
  | "setting"
  | "competition"
  | "competitionStage"
  | "teamCompetitionSeason"
  | "registration"
  | "line-plot"
  | "pie-plot"
  | "staff"
  | "away"
  | "pie-plot_1"
  | "pie-plot_2";
