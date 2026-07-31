import { Label } from "../types";
import { Team } from "./team";
import { Match } from "./match";

export type NationalMatchSeries = {
  _id: string;
  name: string;
  abbr: string | null;
  team: Team;
  matches: Match[];
  joined_at: Date | null;
  left_at: Date | null;
  urls: string[];
};

type NationalMatchSeriesPost = Omit<
  NationalMatchSeries,
  "_id" | "joined_at" | "left_at" | "team" | "matches"
> & {
  team: Team["_id"];
  matches: Match["_id"][];
  joined_at: string | null;
  left_at: string | null;
};

export type NationalMatchSeriesForm = Partial<NationalMatchSeriesPost>;

export type NationalMatchSeriesGet = Omit<
  NationalMatchSeries,
  "team" | "matches"
> & {
  team: Label;
  matches: Label[];
};
