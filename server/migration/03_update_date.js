const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
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
