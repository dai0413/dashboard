import { Label } from "../types";
import { Country } from "./country";
import { Team } from "./team";
import { Match } from "./match";

export type NationalMatchSeries = {
  _id: string;
  name: string;
  abbr: string | null;
  country: Country;
  team: Team;
  matches: Match[];
  joined_at: Date | null;
  left_at: Date | null;
  urls: string[];
};

type NationalMatchSeriesPost = Omit<
  NationalMatchSeries,
  "_id" | "country" | "joined_at" | "left_at" | "team" | "matches"
> & {
  country: Country["_id"];
  team: Team["_id"];
  matches: Match["_id"][];
  joined_at: string | null;
  left_at: string | null;
};

export type NationalMatchSeriesForm = Partial<NationalMatchSeriesPost>;

export type NationalMatchSeriesGet = Omit<
  NationalMatchSeries,
  "country" | "team" | "matches"
> & {
  team: Label;
  country: Label;
  matches: Label[];
};
