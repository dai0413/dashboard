const mongoose = require("mongoose");

const RefereeSchema = new mongoose.Schema(
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
    citizenship: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Country",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
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

module.exports = mongoose.model("Referee", RefereeSchema);
