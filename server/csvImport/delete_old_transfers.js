import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import { mongoose } from "mongoose";
import { Transfer } from "../models/transfer.js";

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("✅ MongoDB 接続成功");

  try {
    const result = await Transfer.deleteMany({
      doa: { $lte: new Date("2025-06-29T23:59:59Z") },
    });

    console.log(`🗑️ ${result.deletedCount} 件のTransferを削除しました`);
  } catch (err) {
    console.error("❌ 削除時のエラー:", err);
  } finally {
    mongoose.disconnect();
  }
});
