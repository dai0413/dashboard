const Injury = require("../models/injury");

const config = {
  MODEL: Injury,
  POPULATE_PATHS: [
    { path: "player", collection: "players" },
    { path: "team", collection: "teams" },
    { path: "now_team", collection: "teams" },
  ],
};

module.exports = { config };
