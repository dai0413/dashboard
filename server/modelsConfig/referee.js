const Referee = require("../models/referee");

const config = {
  MODEL: Referee,
  POPULATE_PATHS: [
    { path: "citizenship", collection: "countries" },
    { path: "player", collection: "players" },
  ],
};

module.exports = { config };
