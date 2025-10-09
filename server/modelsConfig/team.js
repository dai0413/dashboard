import { Team } from "../models/team.js";

export default {
  MODEL: Team,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};
