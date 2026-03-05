import { generateNormalizedEnName, RefereeType } from "@dai0413/myorg-shared";
import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface IReferee
  extends Omit<RefereeType, "_id" | "citizenship" | "player">, Document {
  _id: Types.ObjectId;
  citizenship: Schema.Types.ObjectId[];
  player: Schema.Types.ObjectId;
}

const RefereeSchema: Schema<IReferee> = new Schema<IReferee, any, IReferee>(
  {
    name: { type: String, required: true },
    en_name: { type: String },
    dob: { type: Date },
    pob: { type: String },
    citizenship: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Country",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    transferurl: { type: String },
    sofaurl: { type: String },
    normalized_en_name: { type: String },
    old_id: { type: String },
  },
  { timestamps: true },
);

// transferurl が存在する場合のみユニーク
RefereeSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  },
);

// sofaurl が存在する場合のみユニーク
RefereeSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  },
);

function applyNormalizedEnName(referee: Partial<IReferee>) {
  if (referee.en_name) {
    referee.normalized_en_name = generateNormalizedEnName(referee.en_name);
  }
}

RefereeSchema.pre("validate", async function (next) {
  applyNormalizedEnName(this);
  next();
});

RefereeSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    applyNormalizedEnName(doc);
  }
  next();
});

RefereeSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const rawUpdate = this.getUpdate();
  if (!rawUpdate) return next();

  // update.$set を吸収
  const update = {
    ...(rawUpdate as any),
    ...(rawUpdate as any).$set,
  } as Partial<IReferee>;

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return next();

  // 仮想的な「更新後ドキュメント」
  const merged: Partial<IReferee> = {
    ...doc.toObject(),
    ...update,
  };

  // 正規化
  applyNormalizedEnName(merged);

  // update に反映
  if (merged.normalized_en_name) {
    update.normalized_en_name = merged.normalized_en_name;
  }

  this.setUpdate(update);
  next();
});

export const RefereeModel: Model<IReferee> = mongoose.model<IReferee>(
  "Referee",
  RefereeSchema,
);
