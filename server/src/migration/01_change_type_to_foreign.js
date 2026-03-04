import { mongoose } from "mongoose";
import Country from "../models/country.js";
import Team from "../models/team.js";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // モデルのキャストを避けるために aggregation を使う
    const countries = await Team.aggregate([
      {
        $group: {
          _id: "$country",
        },
      },
    ]);

    console.log(countries);

    // _idだけ抽出して配列に
    const uniqueCountries = countries.map((c) => c._id && c._id);

    console.log("✅ Unique countries:");
    console.log(uniqueCountries);
    console.log(`Total unique: ${uniqueCountries.length}`);

    // for (const country of uniqueCountries) {
    //   const findCountry = await Country.findOne({ name: country });

    //   if (findCountry) {
    //     console.log(country, "find!!", findCountry._id);
    //   } else {
    //     console.log(country, "not found");
    //   }
    // }

    for (const countryName of uniqueCountries) {
      const countryDoc = await Country.findOne({ name: countryName });
      await Team.collection.updateMany(
        { country: countryName },
        { $set: { country: countryDoc._id } }
      );
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
