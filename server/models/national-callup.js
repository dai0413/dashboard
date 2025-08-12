const mongoose = require("mongoose");

const NationalCallUpSchema = new mongoose.Schema(
  {
    series: {
      type: mongoose.ObjectId,
      ref: "NationalMatchSeries",
      required: true,
    },
    player: {
      type: mongoose.ObjectId,
      ref: "Player",
      required: true,
    },
    team: {
      type: mongoose.ObjectId,
      ref: "Team",
    },
    team_name: {
      type: String,
    },
    joined_at: {
      type: Date,
    },
    left_at: {
      type: Date,
    },
    number: {
      type: Number,
    },
    position: {
      type: String,
      enum: ["GK", "DF", "MF", "FW", "MF/FW", "FP"],
    },
    is_captain: { type: Boolean, default: false, required: true },
    is_overage: { type: Boolean, default: false, required: true },
    is_backup: { type: Boolean, default: false, required: true },
    is_training_partner: { type: Boolean, default: false, required: true },
    is_additional_call: { type: Boolean, default: false, required: true },
    status: {
      type: String,
      enum: ["joined", "declined", "withdrawn"],
      default: "joined",
    },
    left_reason: {
      type: String,
      enum: [
        "injury",
        "condition",
        "club",
        "transfer",
        "suspension",
        "personal",
        "management",
        "other",
      ],
    },
  },
  {
    timestamps: true,
  }
);

NationalCallUpSchema.index(
  {
    series: 1,
    player: 1,
  },
  {
    unique: true,
  }
);

NationalCallUpSchema.pre("save", async function (next) {
  try {
    if (!this.series) {
      return next(new Error("series is required"));
    }

    const SeriesModel = mongoose.model("NationalMatchSeries");
    const seriesDoc = await SeriesModel.findById(this.series);

    if (!seriesDoc) {
      return next(new Error("series document not found"));
    }

    if (!this.joined_at) {
      this.joined_at = seriesDoc.joined_at;
    } else if (seriesDoc.joined_at && this.joined_at < seriesDoc.joined_at) {
      this.joined_at = seriesDoc.joined_at;
    }

    if (!this.left_at) {
      this.left_at = seriesDoc.left_at;
    } else if (seriesDoc.left_at && this.left_at > seriesDoc.left_at) {
      this.left_at = seriesDoc.left_at;
    }

    next();
  } catch (err) {
    next(err);
  }
});

NationalCallUpSchema.pre("insertMany", async function (next, docs) {
  try {
    // docs は挿入予定のドキュメント配列
    for (const doc of docs) {
      if (!doc.series) {
        return next(new Error("series is required"));
      }

      const SeriesModel = mongoose.model("NationalMatchSeries");
      const seriesDoc = await SeriesModel.findById(doc.series);

      if (!seriesDoc) {
        return next(new Error(`series document not found: ${doc.series}`));
      }

      // joined_at 補完 & 範囲調整
      if (!doc.joined_at) {
        doc.joined_at = seriesDoc.joined_at;
      } else if (seriesDoc.joined_at && doc.joined_at < seriesDoc.joined_at) {
        doc.joined_at = seriesDoc.joined_at;
      }

      // left_at 補完 & 範囲調整
      if (!doc.left_at) {
        doc.left_at = seriesDoc.left_at;
      } else if (seriesDoc.left_at && doc.left_at > seriesDoc.left_at) {
        doc.left_at = seriesDoc.left_at;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("NationalCallUp", NationalCallUpSchema);
