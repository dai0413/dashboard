const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  team: {
    type: String,
    required: true,
  },
  abbr: {
    type: String,
    unique: true,
    required: true,
  },
  pro: {
    type: String,
    enum: ["プロ", "高校", "大学", "アマ", "ユース"],
  },
});

module.exports = mongoose.model("Team", TeamSchema);
