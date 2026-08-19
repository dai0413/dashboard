import { Label } from "../types";
import { Team } from "./team";
import { Match } from "./match";
import z from "zod";
import {
  NationalMatchSeriesFormSchema,
  NationalMatchSeriesZodSchema,
} from "@dai0413/myorg-shared";

export type NationalMatchSeries = Omit<
  z.infer<typeof NationalMatchSeriesZodSchema>,
  "team" | "matches"
> & {
  team: Team;
  matches: Match[];
};

export type NationalMatchSeriesForm = Partial<
  Omit<
    z.infer<typeof NationalMatchSeriesFormSchema>,
    "joined_at" | "left_at" | "team" | "matches"
  > & {
    team: Team["_id"];
    matches: Match["_id"][];
    joined_at: string;
    left_at: string;
  }
>;

export type NationalMatchSeriesGet = Omit<
  NationalMatchSeries,
  "team" | "matches"
> & {
  team: Label;
  matches: Label[];
};
