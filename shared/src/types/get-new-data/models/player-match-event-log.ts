import {
  PlayerFormSchema,
  MatchEventTypeFormSchema,
  PlayerMatchEventLogFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Player = Partial<z.infer<typeof PlayerFormSchema>> & { number?: number };
type MatchEventType = Partial<z.infer<typeof MatchEventTypeFormSchema>>;

type PrePlayerMatchEventLogScrapedSchema = Omit<
  z.infer<typeof PlayerMatchEventLogFormSchema>,
  "team" | "player" | "match" | "match_event_type"
> & {
  player: Player;
  match_event_type: MatchEventType;
};

export type Scraped = Partial<PrePlayerMatchEventLogScrapedSchema>;
export type Form = Omit<
  z.infer<typeof PlayerMatchEventLogFormSchema>,
  "team" | "player" | "match" | "match_event_type"
> & {
  player?: Label;
  match_event_type?: Label;
};
