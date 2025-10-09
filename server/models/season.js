import { mongoose } from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    start_date: { type: Date },
    end_date: { type: Date },
    current: { type: Boolean },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

SeasonSchema.index(
  {
    competition: 1,
    start_date: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      start_date: { $type: "date" },
    },
  }
);

SeasonSchema.index(
  {
    competition: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const Season = mongoose.model("Season", SeasonSchema);
