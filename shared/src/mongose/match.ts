import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { MatchType } from "../schemas/match.schema.ts";

import { result } from "../enum/result.ts";

export interface IMatch
  extends Omit<
      MatchType,
      | "_id"
      | "competition"
      | "competition_stage"
      | "season"
      | "home_team"
      | "away_team"
      | "match_format"
      | "stadium"
    >,
    Document {
  _id: Types.ObjectId;
  competition: Types.ObjectId;
  competition_stage: Types.ObjectId;
  season: Types.ObjectId;
  home_team: Types.ObjectId;
  away_team: Types.ObjectId;
  match_format: Types.ObjectId;
  stadium: Types.ObjectId;
}

const MatchSchema: Schema<IMatch> = new Schema<IMatch, any, IMatch>(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    competition_stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompetitionStage",
      required: true,
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    home_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    away_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    match_format: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchFormat",
    },
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
    },
    stadium_name: {
      type: String,
    },
    play_time: { type: Number },
    date: { type: Date },
    audience: { type: Number },
    home_goal: { type: Number },
    away_goal: { type: Number },
    home_pk_goal: { type: Number },
    away_pk_goal: { type: Number },
    result: { type: String, enum: result },
    match_week: { type: Number },
    weather: { type: String },
    temperature: { type: Number },
    humidity: { type: Number },
    transferurl: { type: String },
    sofaurl: { type: String },
    urls: { type: [String] },
    old_id: { type: String },
  },
  {
    timestamps: true,
  }
);

// transferurl が存在する場合のみユニーク
MatchSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

// sofaurl が存在する場合のみユニーク
MatchSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

// old_id が存在する場合のみユニーク
MatchSchema.index(
  { old_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      old_id: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

MatchSchema.index(
  {
    competition: 1,
    competition_stage: 1,
    home_team: 1,
    away_team: 1,
    date: 1,
  },
  { unique: true }
);

MatchSchema.index(
  {
    competition: 1,
    competition_stage: 1,
    home_team: 1,
    away_team: 1,
    match_week: 1,
  },
  { unique: true }
);

// --- 共通ユーティリティ ---
async function applyCompetitionSeason(updateOrDoc: Partial<IMatch>) {
  const CompetitionStage = mongoose.model("CompetitionStage");
  const stage = await CompetitionStage.findById(updateOrDoc.competition_stage);
  if (stage) {
    updateOrDoc.competition = stage.competition;
    updateOrDoc.season = stage.season;
  }
}

async function applyPlayTime(updateOrDoc: Partial<IMatch>) {
  const MatchFormat = mongoose.model("MatchFormat");
  const format = await MatchFormat.findById(updateOrDoc.match_format).select(
    "period"
  );

  if (format && Array.isArray(format.period)) {
    const play_time = format.period.reduce(
      (
        total: number,
        p: {
          start: number;
          end: number;
        }
      ) => {
        if (typeof p.start === "number" && typeof p.end === "number") {
          return total + (p.end - p.start);
        }
        return total;
      },
      0
    );

    updateOrDoc.play_time = play_time;
  }
}

async function computeResult(updateOrDoc: Partial<IMatch>) {
  const hasRegularGoals =
    typeof updateOrDoc.home_goal === "number" &&
    typeof updateOrDoc.away_goal === "number";

  const hasPKGoals =
    typeof updateOrDoc.home_pk_goal === "number" &&
    typeof updateOrDoc.away_pk_goal === "number";

  // 両方揃っていない場合は result undefined
  if (!hasRegularGoals && !hasPKGoals) {
    updateOrDoc.result = undefined;
    return;
  }

  // PK が揃っている場合は優先
  let home, away;
  if (hasPKGoals) {
    home = updateOrDoc.home_pk_goal;
    away = updateOrDoc.away_pk_goal;
  } else {
    home = updateOrDoc.home_goal;
    away = updateOrDoc.away_goal;
  }

  if (!home || !away) {
    updateOrDoc.result = undefined;
    return;
  }

  if (home > away) updateOrDoc.result = "home";
  else if (home < away) updateOrDoc.result = "away";
  else updateOrDoc.result = "draw";
}

// --- create / save 時 ---
MatchSchema.pre("validate", async function (next) {
  if (this.competition_stage) {
    await applyCompetitionSeason(this);
  }
  if (this.match_format) {
    await applyPlayTime(this);
  }

  await computeResult(this);

  next();
});

MatchSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    if (doc.competition_stage) {
      await applyCompetitionSeason(doc);
    }
    if (doc.match_format) {
      await applyPlayTime(doc);
    }
    await computeResult(doc);
  }
  next();
});

// --- update 系 ---
MatchSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const rawUpdate = this.getUpdate();
  if (!rawUpdate) return next();

  // update.$set を吸収
  const update = {
    ...(rawUpdate as any),
    ...(rawUpdate as any).$set,
  } as Partial<IMatch>;

  if (update.competition_stage) {
    await applyCompetitionSeason(update);
  }
  if (update.match_format) {
    await applyPlayTime(update);
  }

  await computeResult(update);

  this.setUpdate(update);
  next();
});

export const MatchModel: Model<IMatch> = mongoose.model<IMatch>(
  "Match",
  MatchSchema
);
