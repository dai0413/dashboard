import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "../../dist/models/country.js";
import { generateNormalizedEnName } from "@dai0413/myorg-shared";

const mongoUri = process.env.MONGODB_URI;
const updateField = async () => {
  await mongoose.connect(mongoUri);
  const CountryModel = mongoose.model("Country");

  // Countryモデルにold_id追加
  const result = await CountryModel.updateMany({}, [
    {
      $set: {
        old_id: "$name",
      },
    },
  ]);

  const count = await CountryModel.countDocuments({
    old_id: { $exists: true },
  });
  await mongoose.disconnect();
  process.exit(0);
};

updateField();
