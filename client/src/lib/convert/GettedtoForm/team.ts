import { TeamForm, TeamGet } from "../../../types/models/team";
import { genre } from "../../../utils/createOption/genre";

export const team = (t: TeamGet): TeamForm => {
  const genreOptions = genre().find((item) => item.label === t.genre)?.key;

  return {
    ...t,
    genre: genreOptions ? genreOptions : "",
    country: t.country.id,
  };
};
