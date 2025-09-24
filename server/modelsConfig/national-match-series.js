const NationalMatchSeries = require("../models/national-match-series");

const config = {
  MODEL: NationalMatchSeries,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getALL: {
    query: { field: "country", type: "ObjectId" },
    sort: { joined_at: -1, _id: -1 },
  },
};

module.exports = { config };
