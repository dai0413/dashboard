import { TeamCompetitionSeason } from "../../../types/models/team-competition-season";
import { season } from "./season";
import { team } from "./team";

export const teamCompetitionSeason = (t: TeamCompetitionSeason): string => {
  return `${team(t.team)}-${season(t.season)}`;
};
