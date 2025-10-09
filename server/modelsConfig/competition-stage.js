import { CompetitionStage } from "../models/competition-stage.js";

export default {
  MODEL: CompetitionStage,
  POPULATE_PATHS: [
    { path: "competition", collection: "competitions" },
    { path: "season", collection: "seasons" },
  ],
  bulk: true,
};
