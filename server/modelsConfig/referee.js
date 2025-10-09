import { Referee } from "../models/referee.js";

export default {
  MODEL: Referee,
  POPULATE_PATHS: [
    { path: "citizenship", collection: "countries" },
    { path: "player", collection: "players" },
  ],
};
