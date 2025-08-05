import { teamClassOptions } from "../../context/options-provider";
import { Label } from "../types";
import { Country } from "./country";

const TeamClassOptions = teamClassOptions.map((item) => item.key);

type TeamClass = (typeof TeamClassOptions)[number] | null;

export type NationalMatchSeries = {
  _id: string;
  name: string;
  abbr: string | null;
  country: Country;
  team_class: TeamClass;
  matchs: [];
  joined_at: Date | null;
  left_at: Date | null;
  urls: string[];
};

type NationalMatchSeriesPost = Omit<
  NationalMatchSeries,
  "_id" | "country" | "joined_at" | "left_at"
> & {
  country: Country["_id"];
  joined_at: string | null;
  left_at: string | null;
};

export type NationalMatchSeriesForm = Partial<NationalMatchSeriesPost>;

export type NationalMatchSeriesGet = Omit<NationalMatchSeries, "country"> & {
  country: Label;
};
