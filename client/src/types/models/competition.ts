import { Label } from "../types";
import { Country } from "./country";
import { competitionType } from "../../utils/createOption/competition_type";
import { category } from "../../utils/createOption/category";
import { level } from "../../utils/createOption/level";
import { ageGroup } from "../../utils/createOption/ageGroup";

const CompetitionTypeOptions = competitionType().map((item) => item.key);
const CategoryOptions = category().map((item) => item.key);
const LevelOptions = level().map((item) => item.key);
const AgeGroupOptions = ageGroup().map((item) => item.key);

type CompetitionType = (typeof CompetitionTypeOptions)[number] | null;
type Category = (typeof CategoryOptions)[number] | null;
type Level = (typeof LevelOptions)[number] | null;
type AgeGroup = (typeof AgeGroupOptions)[number] | null;

export type Competition = {
  _id: string;
  name: string;
  abbr: string | null;
  en_name: string | null;
  country?: Country | null;
  competition_type: CompetitionType;
  category?: Category;
  level?: Level;
  age_group?: AgeGroup;
  official_match?: boolean | null;
  transferurl?: null;
  sofaurl?: null;
};

type CompetitionPost = Omit<Competition, "_id" | "country"> & {
  country: Country["_id"] | null;
};

export type CompetitionForm = Partial<CompetitionPost>;

export type CompetitionGet = Omit<Competition, "country"> & {
  country: Label;
};
