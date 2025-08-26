const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    en_name: {
      type: String,
    },
    dob: {
      type: Date,
    },
    pob: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", PlayerSchema);
