const CompetitionStage = require("../models/competition-stage");

const config = {
  MODEL: CompetitionStage,
  POPULATE_PATHS: [
    { path: "competition", collection: "competitions" },
    { path: "season", collection: "seasons" },
  ],
  bulk: true,
};

module.exports = { config };
