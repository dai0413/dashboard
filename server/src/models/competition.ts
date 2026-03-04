import mongoose, { Types, Schema, Document, Model } from "mongoose";

import {
  getKey,
  ageGroup,
  category,
  competitionType,
  CompetitionType,
  level,
} from "@dai0413/myorg-shared";

export interface ICompetition
  extends Omit<CompetitionType, "_id" | "country">,
    Document {
  _id: Types.ObjectId;
  country: Types.ObjectId;
}

const CompetitionSchema: Schema<ICompetition> = new Schema<
  ICompetition,
  any,
  ICompetition
>(
  {
    name: { type: String, required: true },
    abbr: { type: String },
    en_name: { type: String },
    country: { type: Schema.Types.ObjectId, ref: "Country" },
    competition_type: { type: String, enum: getKey(competitionType()) },
    category: { type: String, enum: getKey(category()) },
    level: { type: String, enum: getKey(level()) },
    age_group: { type: String, enum: getKey(ageGroup()) },
    official_match: { type: Boolean },
    transferurl: { type: String },
    sofaurl: { type: String },
  },
  {
    timestamps: true,
  }
);

CompetitionSchema.index(
  {
    name: 1,
    country: 1,
  },
  { unique: true }
);

// transferurl が存在する場合のみユニーク
CompetitionSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

// sofaurl が存在する場合のみユニーク
CompetitionSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

export const CompetitionModel: Model<ICompetition> =
  mongoose.model<ICompetition>("Competition", CompetitionSchema);
