const mongoose = require("mongoose");
const age_group = require("../utils/Enum/age_group");

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
      enum: ["club", "national"],
    },
    age_group: {
      type: String,
      enum: age_group,
    },
    division: {
      type: String,
      enum: ["1st", "2nd", "3rd"],
      default: "1st",
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

TeamSchema.index(
  {
    team: 1,
    country: 1,
  },
  {
    unique: true,
    partialFilterExpression: { country: { $exists: true, $type: "objectId" } },
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
