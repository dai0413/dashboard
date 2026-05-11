import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { getKey, position_formation } from "@dai0413/myorg-shared";
import { key } from "@dai0413/myorg-shared/generateField";
import { FormationZodSchema } from "@dai0413/myorg-shared";
import z from "zod";

type FormationType = z.infer<typeof FormationZodSchema>;

export interface IFormation extends Omit<FormationType, "_id">, Document {
  _id: Types.ObjectId;
}

const FormationSchema = new Schema<IFormation, any, IFormation>(
  {
    name: { type: String, required: true, unique: true },
    position_formation: {
      type: [String],
      enum: getKey(position_formation()),
      required: true,
      validate: [
        {
          validator(values: string[]) {
            return Array.isArray(values) && values.length === 11;
          },
          message: "position_formation は 11 個である必要があります",
        },
        {
          validator(values: string[]) {
            return new Set(values).size === values.length;
          },
          message: "position_formation 内の重複は許可されません",
        },
      ],
    },
    old_id: { type: String },
    key: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

// --- 共通ユーティリティ ---
async function applyKey(updateOrDoc: Partial<IFormation>) {
  updateOrDoc.key = key(updateOrDoc.position_formation);
}

// --- create / save 時 ---
FormationSchema.pre("validate", async function (next) {
  await applyKey(this);
  next();
});

FormationSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    await applyKey(doc);
  }
  next();
});

// --- update 系 ---
FormationSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const rawUpdate = this.getUpdate();
  if (!rawUpdate) return next();

  // update.$set を吸収
  const update = {
    ...(rawUpdate as any),
    ...(rawUpdate as any).$set,
  } as Partial<IFormation>;

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return next();

  // 仮想的な「更新後 Match」
  const merged: Partial<IFormation> = {
    ...doc.toObject(),
    ...update,
  };

  // --- 依存計算 ---
  await applyKey(merged);

  // --- 計算結果を update に反映 ---
  update.key = merged.key;

  this.setUpdate(update);
  next();
});

export const FormationModel: Model<IFormation> = mongoose.model<IFormation>(
  "Formation",
  FormationSchema,
);
