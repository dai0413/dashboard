const Stadium = require("../models/stadium");

const config = {
  MODEL: Stadium,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};

module.exports = { config };
