import { Injury } from "../models/injury.js";

export default {
  MODEL: Injury,
  POPULATE_PATHS: [
    { path: "player", collection: "players" },
    { path: "team", collection: "teams" },
    { path: "now_team", collection: "teams" },
  ],
};
