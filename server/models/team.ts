import {
  getKey,
  ageGroup,
  division,
  genre,
  TeamType,
} from "@dai0413/myorg-shared";
import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface ITeam extends Omit<TeamType, "_id" | "country">, Document {
  _id: Types.ObjectId;
  country: Types.ObjectId;
}

const TeamSchema: Schema<ITeam> = new Schema<ITeam, any, ITeam>(
  {
    team: { type: String, required: true },
    abbr: { type: String },
    enTeam: { type: String },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    genre: { type: String, enum: getKey(genre()) },
    age_group: { type: String, enum: getKey(ageGroup()) },
    division: { type: String, enum: getKey(division()), default: "1st" },
    jdataid: { type: Number },
    labalph: { type: String },
    transferurl: { type: String },
    sofaurl: { type: String },
    normalized_name: { type: String },
    old_id: { type: String },
  },
  { timestamps: true },
);

TeamSchema.index(
  { team: 1, country: 1 },
  {
    unique: true,
    partialFilterExpression: { country: { $exists: true, $type: "objectId" } },
  },
);

// transferurl が存在する場合のみユニーク
TeamSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  },
);

// sofaurl が存在する場合のみユニーク
TeamSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  },
);

function applyNormalizedName(team: Partial<ITeam>) {
  if (team.team) {
    team.normalized_name = team.team.normalize("NFKC");
  }
}

TeamSchema.pre("validate", async function (next) {
  applyNormalizedName(this);
  next();
});

TeamSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    applyNormalizedName(doc);
  }
  next();
});

TeamSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const rawUpdate = this.getUpdate();
  if (!rawUpdate) return next();

  // update.$set を吸収
  const update = {
    ...(rawUpdate as any),
    ...(rawUpdate as any).$set,
  } as Partial<ITeam>;

  const doc = await this.model.findOne(this.getQuery());

  applyNormalizedName({
    ...doc.toObject(),
    ...update,
  });

  this.setUpdate(update);
  next();
});

export const TeamModel: Model<ITeam> = mongoose.model<ITeam>(
  "Team",
  TeamSchema,
);
