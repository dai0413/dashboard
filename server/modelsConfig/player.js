const Player = require("../models/player");

const config = {
  MODEL: Player,
  POPULATE_PATHS: [],
  bulk: true,
};

module.exports = { config };
