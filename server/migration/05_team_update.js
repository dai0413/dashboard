import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import { mongoose } from "mongoose";
const mongoUri = process.env.MONGODB_URI;

(async () => {
  const conn = await mongoose.connect(mongoUri);
  const collection = conn.connection.db.collection("teams");

  // // genre == academy | youth | → 　 genre = club, age_group = youth
  await collection.updateMany(
    { genre: { $in: ["academy", "youth"] } },
    { $set: { genre: "club", age_group: "youth", division: "1st" } }
  );

  // genre == college → 　 genre = club, age_group = university
  await collection.updateMany(
    { genre: "college" },
    { $set: { genre: "club", age_group: "university", division: "1st" } }
  );

  // genre == high_school → 　 genre = club, age_group = high_school
  await collection.updateMany(
    { genre: "high_school" },
    { $set: { genre: "club", age_group: "high_school", division: "1st" } }
  );

  // genre == second_team → 　 genre = club, division= 2nd
  await collection.updateMany(
    { genre: "second_team" },
    { $set: { genre: "club", age_group: "full", division: "2nd" } }
  );

  // genre == third_team → genre = club, division= 3rd
  await collection.updateMany(
    { genre: "third_team" },
    { $set: { genre: "club", age_group: "full", division: "3rd" } }
  );

  // genre == club → 　 genre = club, age_group = full
  await collection.updateMany(
    { genre: "club" },
    { $set: { genre: "club", age_group: "full", division: "1st" } }
  );

  console.log("Migration completed!");

  await conn.disconnect();
})();
