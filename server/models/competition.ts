import mongoose from "mongoose";
import { age_group } from "../../shared/enum/age_group.ts";
import { competition_type } from "../../shared/enum/competition_type.ts";

const CompetitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
    },
    en_name: {
      type: String,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    competition_type: {
      type: String,
      enum: competition_type,
    },
    category: {
      type: String,
      enum: [`league`, `cup`, `po`, `friendly`, `qualification`],
    },
    level: {
      type: String,
      enum: [
        `1部`,
        `2部`,
        `3部`,
        `4部`,
        `5部`,
        `6部`,
        `リーグカップ`,
        `国内カップ戦`,
        `国内スーパーカップ`,
        `入れ替え`,
        `地域大会`,
        `地域予選`,
        `世界大会`,
      ],
    },
    age_group: {
      type: String,
      enum: age_group,
    },
    official_match: {
      type: Boolean,
    },
    transferurl: {
      type: String,
    },
    sofaurl: {
      type: String,
    },
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

export const Competition = mongoose.model("Competition", CompetitionSchema);
