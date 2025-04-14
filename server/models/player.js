const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Player", PlayerSchema);
