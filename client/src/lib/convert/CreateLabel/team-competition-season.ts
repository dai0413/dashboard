import { TeamCompetitionSeason } from "../../../types/models/team-competition-season";

export const teamCompetitionSeason = (t: TeamCompetitionSeason): string => {
  return `${t._id}`;
};
