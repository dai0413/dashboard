import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { generateNormalizedEnName, PlayerType } from "@dai0413/myorg-shared";

export interface IPlayer extends Omit<PlayerType, "_id">, Document {
  _id: Types.ObjectId;
}

const PlayerMongooseSchema: Schema<IPlayer> = new Schema(
  {
    name: { type: String, required: true },
    en_name: { type: String },
    dob: { type: Date },
    pob: { type: String },
    old_id: { type: String },
    normalized_en_name: { type: String },
  },
  { timestamps: true },
);

function applyNormalizedEnName(player: Partial<IPlayer>) {
  if (player.en_name) {
    player.normalized_en_name = generateNormalizedEnName(player.en_name);
  }
}

PlayerMongooseSchema.pre("validate", async function (next) {
  applyNormalizedEnName(this);
  next();
});

PlayerMongooseSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    applyNormalizedEnName(doc);
  }
  next();
});

PlayerMongooseSchema.pre(
  ["findOneAndUpdate", "updateOne"],
  async function (next) {
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return next();

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<IPlayer>;

    const doc = await this.model.findOne(this.getQuery());

    applyNormalizedEnName({
      ...doc.toObject(),
      ...update,
    });

    this.setUpdate(update);
    next();
  },
);

export const PlayerModel: Model<IPlayer> = mongoose.model<IPlayer>(
  "Player",
  PlayerMongooseSchema,
);
