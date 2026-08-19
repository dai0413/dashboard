import { ageGroup, Label } from "@dai0413/myorg-shared";

const AgeGroupOptions = ageGroup().map((item) => item.key);
type AgeGroup = (typeof AgeGroupOptions)[number] | null;

export type Team = {
  label: string;
  key: string;
  abbr?: string;
  country?: Label;
  age_group?: AgeGroup;
};
