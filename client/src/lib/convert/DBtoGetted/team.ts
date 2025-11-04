import { Team, TeamGet } from "../../../types/models/team";
import { ageGroup, genre } from "../../../utils/createOption/Enum";
import { country } from "../CreateLabel/country";

export const team = (t: Team): TeamGet => {
  const genreOptions = genre().find((item) => item.key === t.genre)?.label;
  const ageGroupOptions = ageGroup().find(
    (item) => item.key === t.age_group
  )?.label;

  return {
    ...t,
    genre: genreOptions ? genreOptions : undefined,
    age_group: ageGroupOptions ? ageGroupOptions : undefined,
    country: {
      label: t.country ? country(t.country) : "",
      id: t.country?._id ?? undefined,
    },
  };
};
