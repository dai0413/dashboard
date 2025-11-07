import { RefereeType } from "@myorg/shared";
import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface IReferee
  extends Omit<RefereeType, "_id" | "citizenship" | "player">,
    Document {
  _id: Types.ObjectId;
  citizenship: Schema.Types.ObjectId[];
  player: Schema.Types.ObjectId;
}

const RefereeSchema: Schema<IReferee> = new Schema<IReferee, any, IReferee>(
  {
    name: { type: String, required: true },
    en_name: { type: String },
    dob: { type: Date },
    pob: { type: String },
    citizenship: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Country",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    transferurl: { type: String },
    sofaurl: { type: String },
  },
  { timestamps: true }
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

export const RefereeModel: Model<IReferee> = mongoose.model<IReferee>(
  "Referee",
  RefereeSchema
);
