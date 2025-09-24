const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const mongoUri = process.env.MONGODB_URI;
const INPUT_BASE_PATH = process.env.INPUT_BASE_PATH;
const inputPath = path.join(INPUT_BASE_PATH, "import_player4.csv");

async function importPlayers() {
  const conn = await mongoose.connect(mongoUri);
  const collection = conn.connection.db.collection("players");

  // CSVを読み込む関数をPromiseでラップ
  const results = await new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });

  // CSVの各行を順にDBに保存
  for (const row of results) {
    const id = row._id
      ? new mongoose.Types.ObjectId(row._id.trim())
      : new mongoose.Types.ObjectId();

    if (!row._id) console.log(row.name, "new id created");

    await collection.insertOne({
      _id: id,
      name: row.name,
      en_name: row.en_name ? row.en_name : null,
      dob: row.dob ? new Date(row.dob) : null,
      pob: row.pob ? row.pob : null,
    });
  }

  console.log("Players imported successfully!");
  await mongoose.disconnect();
}

importPlayers().catch(console.error);
