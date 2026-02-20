import { StatsLPopulatedSchema, StatsLFormSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Team } from "./team";

export type StatsL = Omit<
  z.infer<typeof StatsLPopulatedSchema>,
  "match" | "team"
> & {
  match: Match;
  team: Team;
};

export type StatsLForm = Partial<
  Omit<z.infer<typeof StatsLFormSchema>, "match" | "team"> & {
    match: Match["_id"];
    team: Team["_id"];
  }
>;

export type StatsLGet = Omit<StatsL, "match" | "team"> & {
  match: Label;
  team: Label;
};
