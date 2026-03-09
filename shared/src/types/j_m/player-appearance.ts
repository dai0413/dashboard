import {
  PlayerFormSchema,
  PlayerAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Player = Partial<z.infer<typeof PlayerFormSchema>>;

type PrePlayerAppearanceScrapedSchema = Omit<
  z.infer<typeof PlayerAppearanceFormSchema>,
  "team" | "player" | "match" | "position"
> & {
  player: Player;
  key: string;
};

export type Scraped = Partial<PrePlayerAppearanceScrapedSchema>;
export type Form = Omit<
  z.infer<typeof PlayerAppearanceFormSchema>,
  "match" | "team"
> & {
  team?: string;
  key: string;
};
