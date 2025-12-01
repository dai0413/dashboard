import { SeasonType } from "@dai0413/shared";
import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface ISeason
  extends Omit<SeasonType, "_id" | "competition">,
    Document {
  _id: Types.ObjectId;
  competition: Types.ObjectId;
}

const SeasonSchema: Schema<ISeason> = new Schema<ISeason, any, ISeason>(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    name: { type: String, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    current: { type: Boolean },
    note: { type: String },
  },
  { timestamps: true }
);

SeasonSchema.index(
  { competition: 1, start_date: 1 },
  {
    unique: true,
    partialFilterExpression: {
      start_date: { $type: "date" },
    },
  }
);

SeasonSchema.index({ competition: 1, name: 1 }, { unique: true });

export const SeasonModel: Model<ISeason> = mongoose.model<ISeason>(
  "Season",
  SeasonSchema
);
