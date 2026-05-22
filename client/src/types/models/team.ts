import { ageGroup, division, genre } from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Country } from "./country";

const GenreOptions = genre().map((item) => item.key);
type Genre = (typeof GenreOptions)[number];
const AgeGroupOptions = ageGroup().map((item) => item.key);
type AgeGroup = (typeof AgeGroupOptions)[number];
const DivisionOptions = division().map((item) => item.key);
type Division = (typeof DivisionOptions)[number];

export type Team = {
  _id: string;
  team: string;
  abbr?: string;
  enTeam?: string;
  country?: Country;
  genre?: Genre;
  age_group?: AgeGroup;
  division?: Division;
  jdataid?: number;
  labalph?: string;
  transferurl?: string;
  sofaurl?: string;
  old_id?: string;
  normalized_name: string;
};

type TeamPost = Omit<Team, "_id" | "country"> & {
  country: Country["_id"];
};

export type TeamForm = Partial<TeamPost>;

export type TeamGet = Omit<Team, "country"> & {
  country: Label;
};
