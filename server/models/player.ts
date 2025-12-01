import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { PlayerType } from "@dai0413/shared";

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
  },
  { timestamps: true }
);

export const PlayerModel: Model<IPlayer> = mongoose.model<IPlayer>(
  "Player",
  PlayerMongooseSchema
);
