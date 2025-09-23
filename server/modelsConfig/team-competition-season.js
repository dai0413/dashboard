const TeamCompetitionSeason = require("../models/team-competition-season");

const config = {
  MODEL: TeamCompetitionSeason,
  POPULATE_PATHS: [
    { path: "team", collection: "teams" },
    { path: "season", collection: "seasons" },
    { path: "competition", collection: "competitions" },
  ],
};

module.exports = { config };
