import { Competition } from "../models/competition.js";

export default {
  MODEL: Competition,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};
