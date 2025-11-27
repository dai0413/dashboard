import { ageGroup, genre } from "@myorg/shared";
import { TeamForm, TeamGet } from "../../../types/models/team";

export const team = (t: TeamGet): TeamForm => {
  const genreOptions = genre().find((item) => item.label === t.genre)?.key;
  const ageGroupOPtions = ageGroup().find(
    (item) => item.label === t.age_group
  )?.key;

  return {
    ...t,
    genre: genreOptions ? genreOptions : "",
    age_group: ageGroupOPtions ? ageGroupOPtions : "",
    country: t.country.id,
  };
};
