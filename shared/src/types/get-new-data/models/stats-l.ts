import {
  TeamFormSchema,
  MatchFormSchema,
  StatsLFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Match = Partial<z.infer<typeof MatchFormSchema>>;

type PreStatsLFormSchema = Omit<
  z.infer<typeof StatsLFormSchema>,
  "team" | "match"
> & {
  team: Team;
  match: Match;
};

export type Scraped = Partial<PreStatsLFormSchema>;
export type Form = Omit<z.infer<typeof StatsLFormSchema>, "team" | "match"> & {
  team?: Label;
  match?: Label;
};
