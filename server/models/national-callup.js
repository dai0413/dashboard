import { mongoose } from "mongoose";

const NationalCallUpSchema = new mongoose.Schema(
  {
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NationalMatchSeries",
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
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
    position_group: {
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

async function applySeriesDates(doc) {
  const status = doc.status;

  if (status === "declined") {
    // 辞退の場合は期間を空にする
    doc.joined_at = null;
    doc.left_at = null;
    return;
  }

  if (!["joined", "withdrawn"].includes(status)) {
    return; // その他はスキップ
  }

  if (!doc.series) {
    throw new Error("series is required");
  }

  const SeriesModel = mongoose.model("NationalMatchSeries");
  const seriesDoc = await SeriesModel.findById(doc.series);

  if (!seriesDoc) {
    throw new Error(`series document not found: ${doc.series}`);
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

NationalCallUpSchema.pre("save", async function (next) {
  try {
    await applySeriesDates(this);
    next();
  } catch (err) {
    next(err);
  }
});

NationalCallUpSchema.pre("insertMany", async function (next, docs) {
  try {
    for (const doc of docs) {
      await applySeriesDates(doc);
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const NationalCallUp = mongoose.model(
  "NationalCallUp",
  NationalCallUpSchema
);
