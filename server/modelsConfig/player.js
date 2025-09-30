const Player = require("../models/player");

const config = {
  MODEL: Player,
  POPULATE_PATHS: [],
  getALL: {
    query: { field: "country", type: "ObjectId" },
    sort: { _id: 1 },
  },
  bulk: true,
};

module.exports = { config };
