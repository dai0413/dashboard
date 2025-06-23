const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
  doa: {
    type: Date,
    required: true,
  },
  from_team: {
    type: mongoose.ObjectId,
    ref: "Team",
    // required: true,
  },
  from_team_name: {
    type: String,
  },
  to_team: {
    type: mongoose.ObjectId,
    ref: "Team",
    // required: true,
  },
  to_team_name: {
    type: String,
  },
  player: {
    type: mongoose.ObjectId,
    ref: "Player",
    required: true,
  },
  position: {
    type: [String],
    enum: [
      "GK",
      "DF",
      "CB",
      "RCB",
      "LCB",
      "SB",
      "RSB",
      "LSB",
      "WB",
      "RWB",
      "LWB",
      "MF",
      "CM",
      "DM",
      "OM",
      "WG",
      "RWG",
      "LWG",
      "CF",
      "FW",
    ],
  },
  form: {
    type: String,
    enum: [
      "完全",
      "期限付き",
      "期限付き延長",
      "期限付き満了",
      "期限付き解除",
      "育成型期限付き",
      "育成型期限付き延長",
      "育成型期限付き満了",
      "育成型期限付き解除",
      "満了",
      "退団",
      "引退",
      "契約解除",
      "復帰",
      "離脱",
      "更新",
    ],
  },
  number: {
    type: Number,
  },
  from_date: {
    type: Date,
    required: true,
  },
  to_date: {
    type: Date,
    // validate: {
    //   validator: function (value) {
    //     console.log("to_date:", value, "from_date:", this.from_date);
    //     return !value || value > this.from_date;
    //   },
    //   message: "to_date は from_dateより後でなければなりません。",
    // },
  },
  URL: {
    type: [String],
  },
});

TransferSchema.index(
  { doa: 1, from_team: 1, to_team: 1, player: 1, form: 1 },
  { unique: true }
);

module.exports = mongoose.model("Transfer", TransferSchema);
