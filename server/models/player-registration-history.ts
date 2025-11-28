import {
  getKey,
  PlayerRegistrationHistoryType,
  positionGroup,
  registrationType,
} from "@myorg/shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { PlayerRegistrationModel } from "./player-registration.js";
import { asyncRegistration } from "../utils/async/applyHistoryRecord.js";

export interface IPlayerRegistrationHistory
  extends Omit<
      PlayerRegistrationHistoryType,
      "_id" | "season" | "competition" | "player" | "team"
    >,
    Document {
  _id: Types.ObjectId;
  season: Types.ObjectId;
  competition: Types.ObjectId;
  player: Types.ObjectId;
  team: Types.ObjectId;
}

const PlayerRegistrationHistorySchema: Schema<IPlayerRegistrationHistory> =
  new Schema<IPlayerRegistrationHistory, any, IPlayerRegistrationHistory>(
    {
      date: { type: Date },
      season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Season",
        required: true,
      },
      competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competition",
        required: true,
      },
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      registration_type: { type: String, enum: getKey(registrationType()) },
      changes: {
        number: { type: Number },
        position_group: { type: String, enum: getKey(positionGroup()) },
        name: { type: String },
        en_name: { type: String },
        height: { type: Number },
        weight: { type: Number },
        homegrown: { type: Boolean },
        isTypeTwo: { type: Boolean },
        isSpecialDesignation: { type: Boolean },
        note: { type: String },
      },
    },
    { timestamps: true }
  );

PlayerRegistrationHistorySchema.index(
  { date: 1, season: 1, player: 1, team: 1, registration_type: 1 },
  { unique: true }
);

PlayerRegistrationHistorySchema.index(
  { season: 1, player: 1, team: 1, registration_type: 1 },
  { unique: true, partialFilterExpression: { date: { $exists: false } } }
);

async function applyCompetition(
  updateOrDoc: Partial<IPlayerRegistrationHistory>
) {
  if (!updateOrDoc.season) return;

  const Season = mongoose.model("Season");
  const season = await Season.findById(updateOrDoc.season);
  if (season) {
    updateOrDoc.competition = season.competition;
  }
}

function getDiff<T extends Record<string, any>>(
  current: T,
  changes: Partial<T>
): Partial<T> {
  const diff: Partial<T> = {};

  for (const key of Object.keys(changes) as (keyof T)[]) {
    const newValue = changes[key];
    const currentValue = current[key];

    if (newValue === undefined) continue;

    if (String(newValue) !== String(currentValue)) {
      diff[key] = newValue;
    }
  }

  return diff;
}

async function applyDiffForUpdate(update: Partial<IPlayerRegistrationHistory>) {
  if (update.registration_type !== "change" || !update.changes) return;

  const latest = await PlayerRegistrationModel.findOne({
    season: update.season,
    player: update.player,
    team: update.team,
  }).sort({ date: -1 });

  if (latest) {
    update.changes = getDiff(latest.toObject(), update.changes);
  }
}

PlayerRegistrationHistorySchema.pre("validate", async function (next) {
  await normalizeDate(this);
  await applyCompetition(this);

  next();
});

PlayerRegistrationHistorySchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    await normalizeDate(doc);
    await applyDiffForUpdate(doc);
    await applyCompetition(doc);
  }

  next();
});

PlayerRegistrationHistorySchema.pre(
  ["findOneAndUpdate", "updateOne"],
  async function (next) {
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return next();

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<IPlayerRegistrationHistory>;

    await normalizeDate(update);
    await applyDiffForUpdate(update);
    await applyCompetition(update);

    this.setUpdate({ $set: update });

    next();
  }
);

PlayerRegistrationHistorySchema.pre("save", async function (next) {
  await normalizeDate(this);

  // 変更履歴は差分だけにする
  if (this.registration_type === "change") {
    const latest = await PlayerRegistrationModel.findOne({
      season: this.season,
      player: this.player,
      team: this.team,
    }).sort({ date: -1 });

    if (latest) {
      const diff = getDiff(latest.toObject(), this.changes || {});
      this.changes = { ...diff };
    }
  }

  await asyncRegistration(this);

  next();
});

async function normalizeDate(updateOrDoc: any) {
  if (!updateOrDoc?.date) return;

  const d = new Date(updateOrDoc.date);
  if (isNaN(d.getTime())) return;

  d.setUTCHours(0, 0, 0, 0);
  updateOrDoc.date = d;
}

PlayerRegistrationHistorySchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  try {
    // 対応する Registration を取得
    const reg = await PlayerRegistrationModel.findOne({
      season: doc.season,
      player: doc.player,
      team: doc.team,
      date: doc.date,
      registration_type: doc.registration_type,
    });

    if (!reg) return;

    const regAny = reg as any;
    const docAny = doc as any;

    // --- ① changes の中身を展開して Registration に適用 ---
    if (docAny.changes) {
      for (const [key, value] of Object.entries(docAny.changes)) {
        regAny[key] = value;
      }
    }

    // --- ② History のフィールドも完全同期（changes 以外） ---
    const syncKeys = [
      "date",
      "season",
      "competition",
      "player",
      "team",
      "registration_type",
    ];

    for (const key of syncKeys) {
      if (docAny[key] !== undefined) {
        regAny[key] = docAny[key];
      }
    }

    await reg.save();
  } catch (err) {
    console.error("PlayerRegistration full sync error on update:", err);
  }
});

PlayerRegistrationHistorySchema.post(
  "insertMany",
  async function (
    docs: IPlayerRegistrationHistory[] & { _id: Types.ObjectId }[]
  ) {
    for (const doc of docs) {
      await asyncRegistration(doc);
    }
  }
);

export const PlayerRegistrationHistoryModel: Model<IPlayerRegistrationHistory> =
  mongoose.model<IPlayerRegistrationHistory>(
    "PlayerRegistrationHistory",
    PlayerRegistrationHistorySchema
  );
