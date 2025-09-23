const Season = require("../models/season");

const config = {
  MODEL: Season,
  POPULATE_PATHS: [{ path: "competition", collection: "competitions" }],
};

module.exports = { config };
