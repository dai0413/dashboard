import {
  PlayerRegistrationPopulatedSchema,
  PlayerRegistrationFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Season } from "./season";
import { Competition } from "./competition";
import { Player } from "./player";
import { Team } from "./team";

export type PlayerRegistration = Omit<
  z.infer<typeof PlayerRegistrationPopulatedSchema>,
  "season" | "competition" | "player" | "team"
> & {
  season: Season;
  competition: Competition;
  player: Player;
  team: Team;
};

export type PlayerRegistrationForm = Partial<
  Omit<
    z.infer<typeof PlayerRegistrationFormSchema>,
    "season" | "competition" | "player" | "team" | "date"
  > & {
    season: Season["_id"];
    player: Player["_id"];
    team: Team["_id"];
    date: string;
  }
>;

export type PlayerRegistrationGet = Omit<
  PlayerRegistration,
  "season" | "competition" | "player" | "team"
> & {
  season: Label;
  competition: Label;
  player: Label;
  team: Label;
};
