import { mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

(async () => {
  const conn = await mongoose.connect(mongoUri);
  const collection = conn.connection.db.collection("nationalmatchseries");

  // 1. nullをunsetしてundefined扱いに
  const unsetResult = await collection.updateMany(
    { team_class: null },
    { $unset: { team_class: "" } }
  );
  console.log(
    `Unset team_class: Matched: ${unsetResult.matchedCount}, Modified: ${unsetResult.modifiedCount}`
  );

  // 2. team_class -> age_group にリネーム
  const renameResult = await collection.updateMany(
    { team_class: { $exists: true } },
    { $rename: { team_class: "age_group" } }
  );
  console.log(
    `Renamed to age_group: Matched: ${renameResult.matchedCount}, Modified: ${renameResult.modifiedCount}`
  );

  await conn.disconnect();
})();
