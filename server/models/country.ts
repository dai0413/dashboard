import mongoose from "mongoose";
import { area } from "../../shared/enum/area.ts";
import { district } from "../../shared/enum/district.ts";
import { confederation } from "../../shared/enum/confederation.ts";
import { sub_confederation } from "../../shared/enum/sub_confederation.ts";

const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    en_name: {
      type: String,
    },
    iso3: {
      type: String,
      set: (v: string) => v?.toUpperCase(),
    },
    fifa_code: {
      type: String,
      set: (v: string) => v?.toUpperCase(),
    },
    area: {
      type: String,
      enum: area,
    },
    district: {
      type: String,
      enum: district,
    },
    confederation: {
      type: String,
      enum: confederation,
    },
    sub_confederation: {
      type: String,
      enum: sub_confederation,
    },
    established_year: {
      type: Number,
    },
    fifa_member_year: {
      type: Number,
    },
    association_member_year: {
      type: Number,
    },
    district_member_year: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

CountrySchema.index(
  {
    iso3: 1,
    name: 1,
  },
  { unique: true }
);

export const Country = mongoose.model("Country", CountrySchema);
