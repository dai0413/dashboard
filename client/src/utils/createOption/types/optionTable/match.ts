import { Label } from "@dai0413/myorg-shared";

export type Match = {
  label: string;
  key: string;
  competition: string;
  competition_stage: Label;
  season: string;
  match_week: number | undefined;
  home_team: string;
  away_team: string;
};
