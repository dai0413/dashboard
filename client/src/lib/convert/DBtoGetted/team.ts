import { Team, TeamGet } from "../../../types/models/team";
import { genre } from "../../../utils/createOption/genre";

export const team = (t: Team): TeamGet => {
  const genreOptions = genre().find((item) => item.key === t.genre)?.label;

  return {
    ...t,
    genre: genreOptions ? genreOptions : "",
    country: {
      label: t.country?.name ?? "",
      id: t.country?._id ?? "",
    },
  };
};
