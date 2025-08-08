const mongoose = require("mongoose");

const NationalMatchSeriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
    },
    country: {
      type: mongoose.ObjectId,
      ref: "Country",
      required: true,
    },
    team_class: {
      type: String,
      enum: [
        "full",
        "u17",
        "u18",
        "u19",
        "u20",
        "u21",
        "u22",
        "u23",
        "u24",
        "high_school",
        "university",
        "youth",
      ],
    },
    matchs: {
      type: [mongoose.ObjectId],
      ref: "Match",
    },
    joined_at: {
      type: Date,
    },
    left_at: {
      type: Date,
    },
    urls: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

NationalMatchSeriesSchema.index(
  {
    country: 1,
    team_class: 1,
    joined_at: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      joined_at: { $type: "date" },
    },
  }
);

async function syncCallUps(doc) {
  if (!doc) return;

  const NationalCallUp = mongoose.model("NationalCallUp");

  const callUps = await NationalCallUp.find({ series: doc._id });

  const bulkOps = callUps
    .map((cu) => {
      const update = {};
      if (!cu.joined_at) {
        update.joined_at = doc.joined_at;
      }
      if (!cu.left_at) {
        update.left_at = doc.left_at;
      }
      return Object.keys(update).length
        ? {
            updateOne: {
              filter: { _id: cu._id },
              update: { $set: update },
            },
          }
        : null;
    })
    .filter(Boolean);

  if (bulkOps.length > 0) {
    await NationalCallUp.bulkWrite(bulkOps);
    console.log(`📌 ${bulkOps.length} 件の CallUp を series に同期しました`);
  }
}

// findOneAndUpdate後
NationalMatchSeriesSchema.post("findOneAndUpdate", async function (doc) {
  await syncCallUps(doc);
});

// save後
NationalMatchSeriesSchema.post("save", async function (doc) {
  await syncCallUps(doc);
});

module.exports = mongoose.model(
  "NationalMatchSeries",
  NationalMatchSeriesSchema
);
