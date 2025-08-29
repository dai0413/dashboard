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
    },
    sofaurl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// transferurl が存在する場合のみユニーク
TeamSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

// sofaurl が存在する場合のみユニーク
TeamSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

module.exports = mongoose.model("Team", TeamSchema);
