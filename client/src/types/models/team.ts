import { genreOptions } from "../../context/options-provider";

const GenreOptions = genreOptions.map((item) => item.key);
type Genre = (typeof GenreOptions)[number] | null;

export type Team = {
  _id: string;
  team: string;
  abbr: string;
  enTeam: string;
  country: string;
  genre: Genre;
  jdataid: number;
  labalph: string;
  transferurl: string;
  sofaurl: string;
};

type TeamPost = Omit<Team, "_id">;

export type TeamForm = Partial<TeamPost>;

export type TeamGet = Team;
