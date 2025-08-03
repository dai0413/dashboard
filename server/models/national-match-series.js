const mongoose = require("mongoose");

const NationalMatchSeriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
    },
    country: {
      type: mongoose.ObjectId,
      ref: "Country",
      required: true,
    },
    team_class: {
      type: String,
      enum: [
        "full",
        "u17",
        "u18",
        "u19",
        "u20",
        "u21",
        "u22",
        "u23",
        "u24",
        "high_school",
        "university",
        "youth",
      ],
    },
    matchs: {
      type: [mongoose.ObjectId],
      ref: "Match",
    },
    joined_at: {
      type: Date,
    },
    left_at: {
      type: Date,
    },
    urls: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

NationalMatchSeriesSchema.index(
  {
    country: 1,
    team_class: 1,
    joined_at: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      joined_at: { $type: "date" },
    },
  }
);

module.exports = mongoose.model(
  "NationalMatchSeries",
  NationalMatchSeriesSchema
);
