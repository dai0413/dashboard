import {
  getKey,
  special_time,
  periodLabel,
  PlayerMatchEventLogZodSchema,
} from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import z from "zod";

type PlayerMatchEventLogType = z.infer<typeof PlayerMatchEventLogZodSchema>;

export interface IPlayerMatchEventLog
  extends
    Omit<
      PlayerMatchEventLogType,
      "_id" | "match" | "team" | "match_event_type" | "player"
    >,
    Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  team: Types.ObjectId;
  match_event_type: Types.ObjectId;
  player: Types.ObjectId;
}

const PlayerMatchEventLogSchema: Schema<IPlayerMatchEventLog> = new Schema<
  IPlayerMatchEventLog,
  any,
  IPlayerMatchEventLog
>(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    match_event_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchEventType",
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    player_name: { type: String },
    time: { type: Number },
    add_time: { type: Number },
    special_time: { type: String, enum: getKey(special_time()) },
    period_label: { type: String, enum: getKey(periodLabel()) },
    time_name: { type: String },
    order: { type: Number },
    unique_key: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

function buildUniqueKey(doc: any) {
  return [
    doc.match?.toString(),
    doc.match_event_type?.toString(),
    doc.player?.toString() ?? doc.player_name ?? "no-player",
    doc.time_name ?? "no-time",
    doc.order ?? "no-order",
  ].join("|");
}

PlayerMatchEventLogSchema.pre("validate", function (next) {
  this.unique_key = buildUniqueKey(this);
  next();
});

PlayerMatchEventLogSchema.pre(
  "insertMany",
  function (next, docs: IPlayerMatchEventLog[]) {
    docs.forEach((doc) => {
      doc.unique_key = buildUniqueKey(doc);
    });
    next();
  },
);

PlayerMatchEventLogSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (!update) return;

  // aggregation pipeline update は無視
  if (Array.isArray(update)) return;

  if (!update.$set) {
    update.$set = {};
  }

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const merged = {
    ...doc.toObject(),
    ...update.$set,
  };

  update.$set.unique_key = buildUniqueKey(merged);
});

export const PlayerMatchEventLogModel: Model<IPlayerMatchEventLog> =
  mongoose.model<IPlayerMatchEventLog>(
    "PlayerMatchEventLog",
    PlayerMatchEventLogSchema,
  );
