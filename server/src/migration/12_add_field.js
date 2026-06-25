import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "../../dist/models/national-match-series.js";
import "../../dist/models/team.js";
import { generateNormalizedEnName } from "@dai0413/myorg-shared";

const mongoUri = process.env.MONGODB_URI;
const updateField = async () => {
  await mongoose.connect(mongoUri);
  const NationalMatchSeriesModel = mongoose.model("NationalMatchSeries");
  const TeamModel = mongoose.model("Team");

  const nationalMatchSeries = await NationalMatchSeriesModel.find();

  // age_groupとcountryフィールドからteamモデルの_idを取得
  for (const series of nationalMatchSeries) {
    const team = await TeamModel.findOne({
      country: series.country,
      age_group: series.age_group || "full",
      genre: "national",
    });

    if (!team) {
      console.log(`Team not found: ${series.name} (${series._id})`);
      continue;
    }

    await NationalMatchSeriesModel.updateOne(
      { _id: series._id },
      {
        $set: {
          team: team._id,
        },
      },
    );
  }

  const withoutTeam = await NationalMatchSeriesModel.countDocuments({
    team: { $exists: false },
  });

  console.log(`Documents without team: ${withoutTeam}`);

  await mongoose.disconnect();
  process.exit(0);
};

updateField();
