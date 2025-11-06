import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { StadiumType } from "../schemas/stadium.schema";

export interface IStadium
  extends Omit<StadiumType, "_id" | "country">,
    Document {
  _id: Types.ObjectId;
  country: Types.ObjectId;
}

const StadiumSchema: Schema<IStadium> = new Schema<IStadium, any, IStadium>(
  {
    name: { type: String, required: true },
    abbr: { type: String },
    en_name: { type: String },
    alt_names: { type: [String] },
    alt_abbrs: { type: [String] },
    alt_en_names: { type: [String] },
    country: { type: Schema.Types.ObjectId, ref: "Country" },
    transferurl: { type: String },
    sofaurl: { type: String },
  },
  { timestamps: true }
);

StadiumSchema.index({ name: 1, country: 1 }, { unique: true });

// transferurl が存在する場合のみユニーク
StadiumSchema.index(
  { transferurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transferurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

// sofaurl が存在する場合のみユニーク
StadiumSchema.index(
  { sofaurl: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sofaurl: { $exists: true, $ne: null, $type: "string" },
    },
  }
);

export const StadiumModel: Model<IStadium> = mongoose.model<IStadium>(
  "Stadium",
  StadiumSchema
);
