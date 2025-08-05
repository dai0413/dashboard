import { genreOptions } from "../../../context/options-provider";

import { Team, TeamGet } from "../../../types/models/team";

export const team = (t: Team): TeamGet => {
  const genre = genreOptions.find((item) => item.key === t.genre)?.label;

  return {
    ...t,
    genre: genre ? genre : "",
  };
};
