import { ageGroup } from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Country } from "./country";
import { Team } from "./team";

const AgeGroupOptions = ageGroup().map((item) => item.key);

type AgeGroup = (typeof AgeGroupOptions)[number] | null;

export type NationalMatchSeries = {
  _id: string;
  name: string;
  abbr: string | null;
  country: Country;
  team: Team;
  age_group: AgeGroup;
  matchs: [];
  joined_at: Date | null;
  left_at: Date | null;
  urls: string[];
};

type NationalMatchSeriesPost = Omit<
  NationalMatchSeries,
  "_id" | "country" | "joined_at" | "left_at" | "team"
> & {
  country: Country["_id"];
  team: Team["_id"];
  joined_at: string | null;
  left_at: string | null;
};

export type NationalMatchSeriesForm = Partial<NationalMatchSeriesPost>;

export type NationalMatchSeriesGet = Omit<
  NationalMatchSeries,
  "country" | "team"
> & {
  team: Label;
  country: Label;
};
