import { mongoose } from "mongoose";

const RefereeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    en_name: {
      type: String,
    },
    dob: {
      type: Date,
    },
    pob: {
      type: String,
    },
    citizenship: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Country",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
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

// transferurl が存在する場合のみユニーク
RefereeSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

// sofaurl が存在する場合のみユニーク
RefereeSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

export const Referee = mongoose.model("Referee", RefereeSchema);
