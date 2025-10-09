import { Stadium } from "../models/stadium.js";

export default {
  MODEL: Stadium,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
};
