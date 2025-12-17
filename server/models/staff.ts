import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { StaffType } from "@dai0413/myorg-shared";

export interface IStaff extends Omit<StaffType, "_id" | "player">, Document {
  _id: Types.ObjectId;
  player: Types.ObjectId;
}

const StaffSchema: Schema<IStaff> = new Schema(
  {
    name: { type: String, required: true },
    en_name: { type: String },
    dob: { type: Date },
    citizenship: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Country",
    },
    pob: { type: String },
    player: { type: Schema.Types.ObjectId, ref: "Player" },
    old_id: { type: String },
  },
  { timestamps: true }
);

// player が存在する場合のみユニーク
StaffSchema.index(
  { player: 1 },
  {
    unique: true,
    partialFilterExpression: {
      player: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

export const StaffModel: Model<IStaff> = mongoose.model<IStaff>(
  "Staff",
  StaffSchema
);
