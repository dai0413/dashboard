import { ageGroup } from "@dai0413/myorg-shared";

const AgeGroupOptions = ageGroup().map((item) => item.key);
type AgeGroup = (typeof AgeGroupOptions)[number] | null;

export type NationalMatchSeries = {
  label: string;
  key: string;
  country: string;
  team: string;
  age_group: AgeGroup;
};
