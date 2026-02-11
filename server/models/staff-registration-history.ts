import {
  getKey,
  StaffRegistrationHistoryType,
  registrationType,
} from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { StaffRegistrationModel } from "./staff-registration.js";
import { asyncRegistration } from "../utils/async/staffApplyHistoryRecord.js";

export interface IStaffRegistrationHistory
  extends
    Omit<
      StaffRegistrationHistoryType,
      "_id" | "season" | "competition" | "staff" | "team"
    >,
    Document {
  _id: Types.ObjectId;
  season: Types.ObjectId;
  competition: Types.ObjectId;
  staff: Types.ObjectId;
  team: Types.ObjectId;
}

const StaffRegistrationHistorySchema: Schema<IStaffRegistrationHistory> =
  new Schema<IStaffRegistrationHistory, any, IStaffRegistrationHistory>(
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
      staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      registration_type: { type: String, enum: getKey(registrationType()) },
      changes: {
        role: { type: String },
        name: { type: String },
        en_name: { type: String },
        note: { type: String },
      },
    },
    { timestamps: true },
  );

StaffRegistrationHistorySchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
    date: 1,
    "changes.role": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      date: { $exists: true },
      "changes.role": { $exists: true },
    },
  },
);

StaffRegistrationHistorySchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
    date: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "changes.role": { $exists: false },
      date: { $exists: true },
    },
  },
);

StaffRegistrationHistorySchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
    "changes.role": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "changes.role": { $exists: true },
      date: { $exists: false },
    },
  },
);

StaffRegistrationHistorySchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "changes.role": { $exists: false },
      date: { $exists: false },
    },
  },
);

async function applyCompetition(
  updateOrDoc: Partial<IStaffRegistrationHistory>,
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
  changes: Partial<T>,
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

async function applyDiffForUpdate(update: Partial<IStaffRegistrationHistory>) {
  if (update.registration_type !== "change" || !update.changes) return;

  const latest = await StaffRegistrationModel.findOne({
    season: update.season,
    staff: update.staff,
    team: update.team,
  }).sort({ date: -1 });

  if (latest) {
    update.changes = getDiff(latest.toObject(), update.changes);
  }
}

StaffRegistrationHistorySchema.pre("validate", async function (next) {
  await applyCompetition(this);

  next();
});

StaffRegistrationHistorySchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    await applyDiffForUpdate(doc);
    await applyCompetition(doc);
  }

  next();
});

StaffRegistrationHistorySchema.pre(
  ["findOneAndUpdate", "updateOne"],
  async function (next) {
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return next();

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<IStaffRegistrationHistory>;

    await applyDiffForUpdate(update);
    await applyCompetition(update);

    this.setUpdate({ $set: update });

    next();
  },
);

StaffRegistrationHistorySchema.pre("save", async function (next) {
  // 変更履歴は差分だけにする
  if (this.registration_type === "change") {
    const latest = await StaffRegistrationModel.findOne({
      season: this.season,
      staff: this.staff,
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

StaffRegistrationHistorySchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  try {
    // 対応する Registration を取得
    const reg = await StaffRegistrationModel.findOne({
      season: doc.season,
      staff: doc.staff,
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
      "staff",
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
    console.error("StaffRegistration full sync error on update:", err);
  }
});

StaffRegistrationHistorySchema.post(
  "insertMany",
  async function (
    docs: IStaffRegistrationHistory[] & { _id: Types.ObjectId }[],
  ) {
    for (const doc of docs) {
      await asyncRegistration(doc);
    }
  },
);

export const StaffRegistrationHistoryModel: Model<IStaffRegistrationHistory> =
  mongoose.model<IStaffRegistrationHistory>(
    "StaffRegistrationHistory",
    StaffRegistrationHistorySchema,
  );
