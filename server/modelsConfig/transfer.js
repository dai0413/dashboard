const Transfer = require("../models/transfer");

const config = {
  MODEL: Transfer,
  POPULATE_PATHS: [
    { path: "player", collection: "players" },
    { path: "from_team", collection: "teams" },
    { path: "to_team", collection: "teams" },
  ],
};

module.exports = { config };
