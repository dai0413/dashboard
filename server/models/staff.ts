import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { generateNormalizedEnName, StaffType } from "@dai0413/myorg-shared";

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
    normalized_en_name: { type: String },
  },
  { timestamps: true },
);

// player が存在する場合のみユニーク
StaffSchema.index(
  { player: 1 },
  {
    unique: true,
    partialFilterExpression: {
      player: { $exists: true, $ne: null, $type: "string" },
    },
  },
);

function applyNormalizedEnName(staff: Partial<IStaff>) {
  if (staff.en_name) {
    staff.normalized_en_name = generateNormalizedEnName(staff.en_name);
  }
}

StaffSchema.pre("validate", async function (next) {
  applyNormalizedEnName(this);
  next();
});

StaffSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    applyNormalizedEnName(doc);
  }
  next();
});

StaffSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const rawUpdate = this.getUpdate();
  if (!rawUpdate) return next();

  // update.$set を吸収
  const update = {
    ...(rawUpdate as any),
    ...(rawUpdate as any).$set,
  } as Partial<IStaff>;

  const doc = await this.model.findOne(this.getQuery());

  applyNormalizedEnName({
    ...doc.toObject(),
    ...update,
  });

  this.setUpdate(update);
  next();
});

export const StaffModel: Model<IStaff> = mongoose.model<IStaff>(
  "Staff",
  StaffSchema,
);
