import { Season } from "../models/season.js";

export default {
  MODEL: Season,
  POPULATE_PATHS: [{ path: "competition", collection: "competitions" }],
};
