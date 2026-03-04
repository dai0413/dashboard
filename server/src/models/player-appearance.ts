import {
  getKey,
  PlayerAppearanceType,
  play_status,
  position,
} from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPlayerAppearance
  extends
    Omit<PlayerAppearanceType, "_id" | "match" | "player" | "team">,
    Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  player: Types.ObjectId;
  team: Types.ObjectId;
}

const PlayerAppearanceSchema: Schema<IPlayerAppearance> = new Schema<
  IPlayerAppearance,
  any,
  IPlayerAppearance
>(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    player_name: { type: String },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    number: { type: Number },
    play_status: { type: String, enum: getKey(play_status()) },
    position: { type: String, enum: getKey(position()) },
    time: { type: Number },
  },
  { timestamps: true },
);

PlayerAppearanceSchema.index(
  { match: 1, team: 1, player: 1 },
  {
    unique: true,
    partialFilterExpression: {
      player: { $type: "objectId" },
    },
  },
);

PlayerAppearanceSchema.index(
  { match: 1, team: 1, player_name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      player_name: { $type: "string" },
    },
  },
);

export const PlayerAppearanceModel: Model<IPlayerAppearance> =
  mongoose.model<IPlayerAppearance>("PlayerAppearance", PlayerAppearanceSchema);
