import { ageGroup, division, genre } from "../../utils/createOption/Enum";
import { Label } from "../types";
import { Country } from "./country";

const GenreOptions = genre().map((item) => item.key);
type Genre = (typeof GenreOptions)[number] | null;
const AgeGroupOptions = ageGroup().map((item) => item.key);
type AgeGroup = (typeof AgeGroupOptions)[number] | null;
const DivisionOptions = division().map((item) => item.key);
type Division = (typeof DivisionOptions)[number] | null;

export type Team = {
  _id: string;
  team: string;
  abbr?: string;
  enTeam?: string;
  country?: Country | null;
  genre?: Genre;
  age_group?: AgeGroup;
  division?: Division;
  jdataid?: number;
  labalph?: string;
  transferurl?: string;
  sofaurl?: string;
};

type TeamPost = Omit<Team, "_id" | "country"> & {
  country: Country["_id"] | null;
};

export type TeamForm = Partial<TeamPost>;

export type TeamGet = Omit<Team, "country"> & {
  country: Label;
};
