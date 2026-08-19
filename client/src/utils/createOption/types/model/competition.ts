import { ageGroup, category, competitionType } from "@dai0413/myorg-shared";

const CompetitionTypeOptions = competitionType().map((item) => item.key);
const CategoryOptions = category().map((item) => item.key);
const AgeGroupOptions = ageGroup().map((item) => item.key);

type CompetitionType = (typeof CompetitionTypeOptions)[number] | null;
type Category = (typeof CategoryOptions)[number] | null;
type AgeGroup = (typeof AgeGroupOptions)[number] | null;

export type Competition = {
  label: string;
  key: string;
  country?: string;
  competition_type?: CompetitionType;
  category?: Category;
  age_group?: AgeGroup;
};
