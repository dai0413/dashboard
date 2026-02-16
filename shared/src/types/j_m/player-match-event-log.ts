import {
  PlayerFormSchema,
  TeamFormSchema,
  MatchEventTypeFormSchema,
  PlayerMatchEventLogFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Player = Partial<z.infer<typeof PlayerFormSchema>>;
type MatchEventType = Partial<z.infer<typeof MatchEventTypeFormSchema>>;

type PrePlayerMatchEventLogFormSchema = Omit<
  z.infer<typeof PlayerMatchEventLogFormSchema>,
  "team" | "player" | "match" | "match_event_type"
> & {
  team: Team;
  player: Player;
  match_event_type: MatchEventType;
};

export type Form = z.infer<typeof PlayerMatchEventLogFormSchema>;
export type Scraped = Partial<PrePlayerMatchEventLogFormSchema>;
