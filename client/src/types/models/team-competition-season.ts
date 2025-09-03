import { Label } from "../types";
import { Competition } from "./competition";
import { Season } from "./season";
import { Team } from "./team";

export type TeamCompetitionSeason = {
  _id: string;
  team: Team;
  season: Season;
  competition: Competition;
  note?: String | null;
};

type TeamCompetitionSeasonPost = Omit<
  TeamCompetitionSeason,
  "_id" | "team" | "season" | "competition"
> & {
  team: Team["_id"] | null;
  season: Season["_id"] | null;
  competition: Competition["_id"] | null;
};

export type TeamCompetitionSeasonForm = Partial<TeamCompetitionSeasonPost>;

export type TeamCompetitionSeasonGet = Omit<
  TeamCompetitionSeason,
  "team" | "season" | "competition"
> & {
  team: Label;
  season: Label;
  competition: Label;
};
