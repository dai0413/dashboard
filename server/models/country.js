const mongoose = require("mongoose");

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
      set: (v) => v?.toUpperCase(),
    },
    fifa_code: {
      type: String,
      set: (v) => v?.toUpperCase(),
    },
    area: {
      type: String,
      enum: [
        "アジア",
        "ヨーロッパ",
        "アフリカ",
        "オセアニア",
        "北アメリカ",
        "南極",
        "南アメリカ",
        "ミクロネシア",
      ],
    },
    district: {
      type: String,
      enum: [
        "中央アジア",
        "北ヨーロッパ",
        "南ヨーロッパ",
        "北アフリカ",
        "ポリネシア",
        "南部アフリカ",
        "カリブ海",
        "南極大陸",
        "南アメリカ大陸",
        "西アジア",
        "オーストラリア大陸",
        "中央ヨーロッパ",
        "中東",
        "南アジア",
        "東ヨーロッパ",
        "西ヨーロッパ",
        "中央アメリカ",
        "西アフリカ",
        "北大西洋",
        "東南アジア",
        "東アフリカ",
        "中央アフリカ",
        "北アメリカ大陸",
        "中部アフリカ",
        "東アジア",
        "東部アフリカ",
        "南大西洋",
        "メラネシア",
        "インド洋および南極大陸",
        "ミクロネシア",
        "インド洋",
        "東南アフリカ",
        "オセアニア大陸",
        "大西洋",
        "北部アフリカ",
      ],
    },
    confederation: {
      type: String,
      enum: ["AFC", "UEFA", "CAF", "OFC", "CONCACAF", "CONMEBOL", "FSMFA"],
    },
    sub_confederation: {
      type: String,
      enum: [
        "CAFA",
        "UNAF",
        "COSAFA",
        "CFU",
        "AFF",
        "WAFF",
        "SAFF",
        "UNCAF",
        "WAFU",
        "CECAFA",
        "UNIFFAC",
        "NAFU",
        "EAFF",
      ],
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

module.exports = mongoose.model("Country", CountrySchema);
