import mongoose, { Types, Schema, Document, Model } from "mongoose";
import {
  getKey,
  area,
  confederation,
  CountryType,
  district,
  subConfederation,
} from "@dai0413/shared";

export interface ICountry extends Omit<CountryType, "_id">, Document {
  _id: Types.ObjectId;
}

const CountrySchema = new Schema<ICountry, any, ICountry>(
  {
    name: { type: String, required: true },
    en_name: { type: String },
    iso3: { type: String, set: (v: string) => v?.toUpperCase() },
    fifa_code: { type: String, set: (v: string) => v?.toUpperCase() },
    area: { type: String, enum: getKey(area()) },
    district: { type: String, enum: getKey(district()) },
    confederation: { type: String, enum: getKey(confederation()) },
    sub_confederation: { type: String, enum: getKey(subConfederation()) },
    established_year: { type: Number },
    fifa_member_year: { type: Number },
    association_member_year: { type: Number },
    district_member_year: { type: Number },
  },
  {
    timestamps: true,
  }
);

CountrySchema.index({ iso3: 1, name: 1 }, { unique: true });

export const CountryModel: Model<ICountry> = mongoose.model<ICountry>(
  "Country",
  CountrySchema
);
