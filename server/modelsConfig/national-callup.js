import { NationalCallUp } from "../models/national-callup.js";

export default {
  MODEL: NationalCallUp,
  POPULATE_PATHS: [
    { path: "series", collection: "nationalmatchseries" },
    { path: "player", collection: "players" },
    { path: "team", collection: "teams" },
  ],
  bulk: true,
};
