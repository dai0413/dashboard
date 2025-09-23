const NationalMatchSeries = require("../models/national-match-series");

const config = {
  MODEL: NationalMatchSeries,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};

module.exports = { config };
