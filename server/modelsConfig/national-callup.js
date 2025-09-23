const NationalCallUp = require("../models/national-callup");

const config = {
  MODEL: NationalCallUp,
  POPULATE_PATHS: [
    { path: "series", collection: "nationalmatchseries" },
    { path: "player", collection: "players" },
    { path: "team", collection: "teams" },
  ],
  bulk: true,
};

module.exports = { config };
