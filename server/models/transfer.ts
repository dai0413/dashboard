import mongoose from "mongoose";
import { position } from "../../shared/enum/position.ts";
import { form } from "../../shared/enum/form.ts";

const TransferSchema = new mongoose.Schema(
  {
    doa: {
      type: Date,
      required: true,
    },
    from_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    from_team_name: {
      type: String,
    },
    to_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
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
      enum: position,
    },
    form: {
      type: String,
      enum: form,
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
async function syncNowTeam(playerId: string) {
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
