const Competition = require("../models/competition");

const config = {
  MODEL: Competition,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};

module.exports = { config };
