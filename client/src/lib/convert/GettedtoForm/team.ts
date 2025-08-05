import { genreOptions } from "../../../context/options-provider";
import { TeamForm, TeamGet } from "../../../types/models/team";

export const team = (t: TeamGet): TeamForm => {
  const genre = genreOptions.find((item) => item.label === t.genre)?.key;

  return {
    ...t,
    genre: genre ? genre : "",
  };
};
