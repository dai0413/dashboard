const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    team: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
    },
    enTeam: {
      type: String,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    genre: {
      type: String,
      enum: [
        "academy",
        "club",
        "college",
        "high_school",
        "second_team",
        "third_team",
        "youth",
      ],
    },
    jdataid: {
      type: Number,
    },
    labalph: {
      type: String,
    },
    transferurl: {
      type: String,
      unique: true,
    },
    sofaurl: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", TeamSchema);
