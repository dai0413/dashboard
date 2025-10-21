import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const INPUT_BASE_PATH = process.env.INPUT_BASE_PATH;
const inputPath = path.join(INPUT_BASE_PATH, "teams2.csv");

(async () => {
  const conn = await mongoose.connect(mongoUri);
  const collection = conn.connection.db.collection("teams");

  const updates = [];
  fs.createReadStream(inputPath)
    .pipe(csv())
    .on("data", (row) => updates.push(row))
    .on("end", async () => {
      for (const u of updates) {
        const update = {};
        // old_genre に応じて age_group / division を設定

        switch (u.old_genre) {
          case "academy":
          case "youth":
            update.genre = "club";
            update.age_group = "youth";
            update.division = "1st";
            break;
          case "college":
            update.genre = "club";
            update.age_group = "university";
            update.division = "1st";
            break;
          case "high_school":
            update.genre = "club";
            update.age_group = "high_school";
            update.division = "1st";
            break;
          case "second_team":
            update.genre = "club";
            update.age_group = "full";
            update.division = "2nd";
            break;
          case "third_team":
            update.genre = "club";
            update.age_group = "full";
            update.division = "3rd";
            break;
          case "club":
            update.genre = "club";
            update.age_group = "full";
            update.division = "1st";
            break;
        }

        const targetItem = await collection.findOne({
          _id: new mongoose.Types.ObjectId(u["id"]),
        });
        if (!targetItem) console.log("ERROR------", u.id, u.team);

        await collection.updateOne(
          { _id: new mongoose.Types.ObjectId(u["id"]) },
          { $set: update }
        );
      }

      console.log("Restoration completed!");
      await conn.disconnect();
    });
})();
