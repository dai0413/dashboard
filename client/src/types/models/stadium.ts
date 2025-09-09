import { Label } from "../types";
import { Country } from "./country";

export type Stadium = {
  _id: string;
  name: string;
  abbr?: string;
  en_name?: string;
  alt_names: string[];
  alt_abbrs: string[];
  alt_en_names: string[];
  country: Country;
  transferurl?: null;
  sofaurl?: null;
};

type StadiumPost = Omit<Stadium, "_id" | "country"> & {
  country: Country["_id"] | null;
};

export type StadiumForm = Partial<StadiumPost>;

export type StadiumGet = Omit<Stadium, "country"> & {
  country: Label;
};
