import {
  PlayerFormSchema,
  TeamFormSchema,
  CompetitionFormSchema,
  PlayerRegistrationHistoryFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Player = Partial<z.infer<typeof PlayerFormSchema>>;
type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Competition = Partial<z.infer<typeof CompetitionFormSchema>>;

type PrePlayerRegistrationHistory = Omit<
  z.infer<typeof PlayerRegistrationHistoryFormSchema>,
  "player" | "team"
> & {
  player: Player;
  team: Team;
  competition: Competition;
};

export type Scraped = Partial<PrePlayerRegistrationHistory>;
export type Form = z.infer<typeof PlayerRegistrationHistoryFormSchema>;
