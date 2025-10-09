import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import { mongoose } from "mongoose";
const mongoUri = process.env.MONGODB_URI;

(async () => {
  try {
    const conn = await mongoose.connect(mongoUri);

    const result = await conn.connection.db
      .collection("nationalcallups")
      .updateMany(
        { status: "declined" },
        { $set: { joined_at: null, left_at: null } }
      );

    console.log(`updated ${result.modifiedCount} documents`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
