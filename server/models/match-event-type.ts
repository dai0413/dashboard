import { MatchEventTypeType, getKey, event_type } from "@dai0413/myorg-shared";
import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface IMatchEventType
  extends Omit<MatchEventTypeType, "_id">,
    Document {
  _id: Types.ObjectId;
}

const MatchEventTypeSchema: Schema<IMatchEventType> = new Schema<
  IMatchEventType,
  any,
  IMatchEventType
>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    en_name: {
      type: String,
      required: true,
      unique: true,
    },
    abbr: {
      type: String,
      required: true,
      unique: true,
    },
    event_type: { type: String, enum: getKey(event_type()) },
  },
  {
    timestamps: true,
  }
);

export const MatchEventTypeModel: Model<IMatchEventType> =
  mongoose.model<IMatchEventType>("MatchEventType", MatchEventTypeSchema);
