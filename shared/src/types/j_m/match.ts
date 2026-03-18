import {
  TeamFormSchema,
  MatchFormatFormSchema,
  StadiumFormSchema,
  CompetitionStageFormSchema,
  MatchFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type MatchFormat = Partial<z.infer<typeof MatchFormatFormSchema>>;
type Stadium = Partial<z.infer<typeof StadiumFormSchema>>;
type CompetitionStage = Partial<z.infer<typeof CompetitionStageFormSchema>>;

type PreMatchFormSchema = Omit<
  z.infer<typeof MatchFormSchema>,
  "competition_stage" | "home_team" | "away_team" | "stadium" | "match_format"
> & {
  competition_stage: CompetitionStage;
  home_team: Team;
  away_team: Team;
  match_format: MatchFormat;
  stadium: Stadium;
};

export type Scraped = Partial<PreMatchFormSchema>;
export type Form = Omit<
  z.infer<typeof MatchFormSchema>,
  "home_team" | "away_team" | "match_format" | "stadium"
> & {
  home_team?: Label;
  away_team?: Label;
  match_format?: Label;
  stadium?: Label;
};
