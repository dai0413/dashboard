import { mongoose } from "mongoose";

const TransferSchema = new mongoose.Schema(
  {
    doa: {
      type: Date,
      required: true,
    },
    from_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      // required: true,
    },
    from_team_name: {
      type: String,
    },
    to_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      // required: true,
    },
    to_team_name: {
      type: String,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
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
        "LCM",
        "RCM",
        "DM",
        "OM",
        "SH",
        "WG",
        "RIH",
        "LIH",
        "RSH",
        "LSH",
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
        "内定解除",
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
  },
  {
    timestamps: true,
  }
);

TransferSchema.index(
  {
    from_team: 1,
    from_team_name: 1,
    to_team: 1,
    to_team_name: 1,
    player: 1,
    form: 1,
    from_date: 1,
    to_date: 1,
  },
  { unique: true }
);

// injuryモデルのnow_teamを更新
async function syncNowTeam(playerId) {
  const Transfer = mongoose.model("Transfer");
  const Injury = mongoose.model("Injury");

  const latest = await Transfer.findOne({
    player: playerId,
    to_team: { $ne: null },
  }).sort({ from_date: -1, _id: -1 });

  await Injury.updateMany(
    { player: playerId },
    { $set: { now_team: latest ? latest.to_team : null } }
  );
}

// save
TransferSchema.post("save", async function (doc, next) {
  await syncNowTeam(doc.player);
  next();
});

// findOneAndUpdate / updateOne / updateMany
TransferSchema.post(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  async function (res, next) {
    if (this.getQuery().player) {
      await syncNowTeam(this.getQuery().player);
    }
    next();
  }
);

// insertMany
TransferSchema.post("insertMany", async function (docs, next) {
  const playerIds = [...new Set(docs.map((d) => d.player.toString()))];
  await Promise.all(playerIds.map((id) => syncNowTeam(id)));
  next();
});

// delete
TransferSchema.post(
  ["findOneAndDelete", "deleteOne", "deleteMany"],
  async function (res, next) {
    if (!res) return next();

    const playerIds = Array.isArray(res)
      ? res.map((d) => d.player)
      : [res.player];
    await Promise.all(playerIds.map((id) => syncNowTeam(id)));
    next();
  }
);

export const Transfer = mongoose.model("Transfer", TransferSchema);
