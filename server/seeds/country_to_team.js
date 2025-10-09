import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import { mongoose } from "mongoose";

import Country from "../models/country.js";
import Team from "../models/team.js";

const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  const conn = await mongoose.connect(mongoUri);

  const countries = await Country.find();

  for (const country of countries) {
    // すでにその国の代表チームが存在するかチェック
    const exists = await Team.findOne({
      country: country._id,
      genre: "national",
      age_group: "full",
    });

    if (!exists) {
      await Team.create({
        team: country.name,
        enTeam: country.en_name,
        abbr: country.fifa_code,
        country: country._id,
        genre: "national",
        age_group: "full",
        division: "1st",
      });
      console.log(`Added national team for ${country.name}`);
    }
  }

  console.log("National teams migration completed!");
  await conn.disconnect();
})();
