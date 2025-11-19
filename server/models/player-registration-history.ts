import {
  PlayerRegistrationHistoryType,
  position_group,
  registration_type,
} from "@myorg/shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { PlayerRegistrationModel } from "./player-registration.js";
import { PlayerModel } from "./player.js";

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
      registration_type: { type: String, enum: registration_type },
      changes: {
        number: { type: Number },
        position_group: { type: String, enum: position_group },
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

  if (this.registration_type === "register") {
    await handleRegister(this);
  } else if (this.registration_type === "change") {
    await handleChange(this);
  } else if (this.registration_type === "deregister") {
    await handleDeregister(this);
  }

  next();
});

async function handleRegister(prh: IPlayerRegistrationHistory) {
  // ① 新規 PR を作成
  const newReg = await PlayerRegistrationModel.create({
    date: prh.date,
    season: prh.season,
    competition: prh.competition,
    player: prh.player,
    team: prh.team,
    registration_type: "register",
    ...prh.changes, // number, name, etc.
    registration_status: "active",
  });

  // ② 同一 season & player の PR を取得
  const regs = await PlayerRegistrationModel.find({
    season: prh.season,
    player: prh.player,
  }).sort({ date: 1 });

  // ③ 最も新しい PR を active、それ以外を terminated
  for (let i = 0; i < regs.length; i++) {
    regs[i].registration_status =
      i === regs.length - 1 ? "active" : "terminated";
    await regs[i].save();
  }

  return newReg;
}

async function handleChange(prh: IPlayerRegistrationHistory) {
  const latest = await PlayerRegistrationModel.findOne({
    season: prh.season,
    player: prh.player,
    team: prh.team,
  }).sort({ date: -1 });

  if (!latest) return;

  // 差分を適用
  if (prh.changes && Object.keys(prh.changes).length > 0) {
    // _$set で差分だけを更新_
    await PlayerRegistrationModel.updateOne(
      { _id: latest._id },
      { $set: prh.changes }
    );
  }

  return;
}

async function handleDeregister(prh: IPlayerRegistrationHistory) {
  // ① deregister データを新規作成
  await PlayerRegistrationModel.create({
    date: prh.date,
    season: prh.season,
    competition: prh.competition,
    player: prh.player,
    team: prh.team,
    ...prh.changes, // number, name, etc.
    registration_type: "deregister",
    registration_status: "terminated",
  });

  // ② 同一 season & player の PR のうち、prh.date より前のものを terminated
  await PlayerRegistrationModel.updateMany(
    {
      season: prh.season,
      player: prh.player,
      date: { $lte: prh.date },
    },
    { $set: { registration_status: "terminated" } }
  );
}

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

export const PlayerRegistrationHistoryModel: Model<IPlayerRegistrationHistory> =
  mongoose.model<IPlayerRegistrationHistory>(
    "PlayerRegistrationHistory",
    PlayerRegistrationHistorySchema
  );
