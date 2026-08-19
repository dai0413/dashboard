import {
  NationalCallUpFormSchema,
  NationalCallUpZodSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import { NationalMatchSeries } from "./national-match-series";
import { Player } from "./player";
import { Team } from "./team";
import z from "zod";

export type NationalCallup = Omit<
  z.infer<typeof NationalCallUpZodSchema>,
  "series" | "player" | "team"
> & {
  series: NationalMatchSeries;
  player: Player;
  team: Team;
};

export type NationalCallupForm = Partial<
  Omit<
    z.infer<typeof NationalCallUpFormSchema>,
    "series" | "player" | "team" | "joined_at" | "left_at"
  > & {
    series: NationalMatchSeries["_id"];
    player: Player["_id"];
    team: Team["_id"];
    joined_at?: string;
    left_at?: string;
  }
>;

export type NationalCallupGet = Omit<
  NationalCallup,
  "series" | "player" | "team"
> & {
  series: Label;
  player: Label;
  team: Label;
};
