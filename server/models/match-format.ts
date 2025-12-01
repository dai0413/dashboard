import { MatchFormatType, getKey, periodLabel } from "@dai0413/myorg-shared";
import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface IMatchFormat extends Omit<MatchFormatType, "_id">, Document {
  _id: Types.ObjectId;
}

const PeriodSchema = new mongoose.Schema(
  {
    period_label: {
      type: String,
      required: true,
      enum: getKey(periodLabel()),
    },
    start: {
      type: Number,
      default: undefined,
      validate: {
        validator: function (value: number) {
          const doc = this as { start?: number; end?: number };
          if (value == undefined || doc.end == undefined) return true;
          return doc.start! <= doc.end!;
        },
        message: "start must be less than or equal to end",
      },
    },
    end: {
      type: Number,
      default: undefined,
      validate: {
        validator: function (value: number) {
          const doc = this as { start?: number; end?: number };
          if (value == undefined || doc.end == undefined) return true;
          return doc.start! <= doc.end!;
        },
        message: "end must be greater than or equal to start",
      },
    },
    order: { type: Number, default: 0 },
  },
  { _id: false } // period単位で_idいらない
);

const MatchFormatSchema: Schema<IMatchFormat> = new Schema<
  IMatchFormat,
  any,
  IMatchFormat
>(
  {
    name: { type: String, required: true, unique: true },
    period: [PeriodSchema],
  },
  { timestamps: true }
);

export const MatchFormatModel: Model<IMatchFormat> =
  mongoose.model<IMatchFormat>("MatchFormat", MatchFormatSchema);
