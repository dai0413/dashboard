import {
  TeamFormSchema,
  MatchFormatFormSchema,
  StadiumFormSchema,
  MatchFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type MatchFormat = Partial<z.infer<typeof MatchFormatFormSchema>>;
type Stadium = Partial<z.infer<typeof StadiumFormSchema>>;

type PreMatchFormSchema = Omit<
  z.infer<typeof MatchFormSchema>,
  "home_team" | "away_team" | "stadium" | "match_format" | "competition_stage"
> & {
  home_team: Team;
  away_team: Team;
  match_format: MatchFormat;
  stadium: Stadium;
  competition_stage?: Label;
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
