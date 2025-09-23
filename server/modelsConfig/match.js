const Match = require("../models/match");

const config = {
  MODEL: Match,
  POPULATE_PATHS: [
    { path: "competition", collection: "competitions" },
    { path: "competition_stage", collection: "competitionstages" },
    { path: "season", collection: "seasons" },
    { path: "home_team", collection: "teams" },
    { path: "away_team", collection: "teams" },
    { path: "match_format", collection: "matchformats" },
    { path: "stadium", collection: "stadia" },
  ],
};

module.exports = { config };
