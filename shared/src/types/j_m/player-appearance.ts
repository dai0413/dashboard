import {
  PlayerFormSchema,
  TeamFormSchema,
  PlayerAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Player = Partial<z.infer<typeof PlayerFormSchema>>;

type PrePlayerAppearanceFormSchema = Omit<
  z.infer<typeof PlayerAppearanceFormSchema>,
  "team" | "player" | "match" | "position"
> & {
  team: Team;
  player: Player;
};

export type Scraped = Partial<PrePlayerAppearanceFormSchema>;
export type Form = z.infer<typeof PlayerAppearanceFormSchema>;
