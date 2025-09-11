import { Team, TeamGet } from "../../../types/models/team";
import { ageGroup, genre } from "../../../utils/createOption/Enum";

export const team = (t: Team): TeamGet => {
  const genreOptions = genre().find((item) => item.key === t.genre)?.label;
  const ageGroupOptions = ageGroup().find(
    (item) => item.key === t.age_group
  )?.label;

  return {
    ...t,
    genre: genreOptions ? genreOptions : "",
    age_group: ageGroupOptions ? ageGroupOptions : "",
    country: {
      label: t.country?.name ?? "",
      id: t.country?._id ?? "",
    },
  };
};
