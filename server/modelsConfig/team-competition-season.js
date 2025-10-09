import { TeamCompetitionSeason } from "../models/team-competition-season.js";

export default {
  MODEL: TeamCompetitionSeason,
  POPULATE_PATHS: [
    { path: "team", collection: "teams" },
    { path: "season", collection: "seasons" },
    { path: "competition", collection: "competitions" },
  ],
};
