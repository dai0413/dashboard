import { StaffAppearanceType } from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStaffAppearance
  extends
    Omit<StaffAppearanceType, "_id" | "match" | "staff" | "team">,
    Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  staff: Types.ObjectId;
  team: Types.ObjectId;
}

const StaffAppearanceSchema: Schema<IStaffAppearance> = new Schema<
  IStaffAppearance,
  any,
  IStaffAppearance
>(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    staff_name: { type: String },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    role: { type: String },
  },
  { timestamps: true },
);

StaffAppearanceSchema.index({ match: 1, team: 1, staff: 1 }, { unique: true });
StaffAppearanceSchema.index(
  { match: 1, team: 1, staff_name: 1 },
  { unique: true },
);

export const StaffAppearanceModel: Model<IStaffAppearance> =
  mongoose.model<IStaffAppearance>("StaffAppearance", StaffAppearanceSchema);
