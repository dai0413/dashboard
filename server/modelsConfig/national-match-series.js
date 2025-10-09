import { NationalMatchSeries } from "../models/national-match-series.js";

export default {
  MODEL: NationalMatchSeries,
  POPULATE_PATHS: [{ path: "country", collection: "countries" }],
  getALL: {
    query: { field: "country", type: "ObjectId" },
    sort: { joined_at: -1, _id: -1 },
  },
};
