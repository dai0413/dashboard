import {
  PlayerFormSchema,
  MatchEventTypeFormSchema,
  PlayerMatchEventLogFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Player = Partial<z.infer<typeof PlayerFormSchema>>;
type MatchEventType = Partial<z.infer<typeof MatchEventTypeFormSchema>>;

type PrePlayerMatchEventLogScrapedSchema = Omit<
  z.infer<typeof PlayerMatchEventLogFormSchema>,
  "team" | "player" | "match" | "match_event_type"
> & {
  player: Player;
  match_event_type: MatchEventType;
  key: string;
};

export type Form = Omit<
  z.infer<typeof PlayerMatchEventLogFormSchema>,
  "match" | "team"
> & {
  team?: string;
  key: string;
};
export type Scraped = Partial<PrePlayerMatchEventLogScrapedSchema>;
