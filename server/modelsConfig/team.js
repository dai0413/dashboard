const Team = require("../models/team");

const config = {
  MODEL: Team,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};

module.exports = { config };
