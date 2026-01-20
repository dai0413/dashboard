import {
  PlayerAppearancePopulatedSchema,
  PlayerAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Player } from "./player";
import { Team } from "./team";

export type PlayerAppearance = Omit<
  z.infer<typeof PlayerAppearancePopulatedSchema>,
  "match" | "player" | "team"
> & {
  match: Match;
  player: Player;
  team: Team;
};

export type PlayerAppearanceForm = Partial<
  Omit<
    z.infer<typeof PlayerAppearanceFormSchema>,
    "match" | "player" | "team"
  > & {
    match: Match["_id"];
    player: Player["_id"];
    team: Team["_id"];
  }
>;

export type PlayerAppearanceGet = Omit<
  PlayerAppearance,
  "match" | "player" | "team"
> & {
  match: Label;
  player: Label;
  team: Label;
};
