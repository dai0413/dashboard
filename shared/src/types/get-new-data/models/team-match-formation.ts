import {
  FormationFormSchema,
  Label,
  MatchFormSchema,
  TeamFormSchema,
  TeamMatchFormationFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Match = Partial<z.infer<typeof MatchFormSchema>>;
type Formation = Partial<z.infer<typeof FormationFormSchema>>;

type PreTeamMatchFormationSchema = Omit<
  z.infer<typeof TeamMatchFormationFormSchema>,
  "team" | "match" | "formation"
> & {
  team: Team;
  match?: Match;
  formation: Formation;
};

export type Scraped = Partial<PreTeamMatchFormationSchema>;
export type Form = Omit<
  z.infer<typeof TeamMatchFormationFormSchema>,
  "team" | "match" | "formation"
> & {
  team?: Label;
  match?: Label;
  formation?: Label;
};
