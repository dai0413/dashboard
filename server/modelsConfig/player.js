import { Player } from "../models/player.js";

export default {
  MODEL: Player,
  POPULATE_PATHS: [],
  getALL: {
    query: { field: "country", type: "ObjectId" },
    sort: { _id: 1 },
  },
  bulk: true,
};
