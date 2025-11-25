import dotenv from "dotenv";
dotenv.config();

import connectDB from "../dist/db/connect.js";
import mongoose from "mongoose";
import { PlayerModel } from "../dist/models/player.js";
import { TeamModel } from "../dist/models/team.js";
import { SeasonModel } from "../dist/models/season.js";
import { PlayerRegistrationModel } from "../dist/models/player-registration.js";
import { PlayerRegistrationHistoryModel } from "../dist/models/player-registration-history.js";
import { asyncRegistration } from "../dist/utils/async/applyHistoryRecord.js";

async function rebuildPlayerRegistrationFromHistory() {
  console.log("=== PlayerRegistration 再構築開始 ===");

  // まず main を空に
  await PlayerRegistrationModel.deleteMany({});
  console.log("Main テーブルをクリアしました");

  // 全 history を取得（player + season + team の時系列順）
  const histories = await PlayerRegistrationHistoryModel.find({})
    .sort({ season: 1, player: 1, team: 1, date: 1 })
    .lean();

  let count = 0;

  for (const hist of histories) {
    await asyncRegistration(hist);
    count++;
  }

  console.log(`=== 再構築完了: ${count} 件処理しました ===`);
}

const url = process.env.MONGODB_URI;

async function start() {
  try {
    if (!url) {
      console.error("❌ MONGODB_URI が設定されていません");
      process.exit(1);
    }

    await connectDB(url);
    console.log("MongoDB 接続完了");

    await rebuildPlayerRegistrationFromHistory();
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log("DB 接続をクローズしました");
    process.exit(0);
  }
}

start();
