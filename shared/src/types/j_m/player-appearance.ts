import {
  PlayerFormSchema,
  PlayerAppearanceFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Player = Partial<z.infer<typeof PlayerFormSchema>>;

type PrePlayerAppearanceScrapedSchema = Omit<
  z.infer<typeof PlayerAppearanceFormSchema>,
  "team" | "player" | "match" | "position"
> & {
  player: Player;
  key: string;
  start_time?: number;
  end_time?: number;
};

export type Scraped = Partial<PrePlayerAppearanceScrapedSchema>;
export type Form = Omit<
  z.infer<typeof PlayerAppearanceFormSchema>,
  "match" | "team" | "player"
> & {
  key: string;
  player?: Label;
  start_time?: number;
  end_time?: number;
};
