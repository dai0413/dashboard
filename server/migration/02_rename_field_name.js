const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const mongoUri = process.env.MONGODB_URI;

(async () => {
  const conn = await mongoose.connect(mongoUri);

  // ネイティブコレクションで直接 rename 実行
  const result = await conn.connection.db
    .collection("nationalcallups")
    .updateMany(
      { position: { $exists: true } },
      { $rename: { position: "position_group" } }
    );

  console.log(
    `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
  );
  await conn.disconnect();
})();
