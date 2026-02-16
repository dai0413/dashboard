import {
  PlayerAppearanceFormSchema,
  position_formation,
} from "@dai0413/myorg-shared";
import { z } from "zod";

const position_name = position_formation();
type PositionFormation = (typeof position_name)[number]["key"];

export type Scraped = {
  number?: number | undefined;
  player_name?: string | undefined;
  team?: {
    team?: string;
    abbr?: string | undefined;
  };
  player?: { name?: string };
  position?: PositionFormation;
};
export type Form = z.infer<typeof PlayerAppearanceFormSchema>;
