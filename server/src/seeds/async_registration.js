import dotenv from "dotenv";
dotenv.config();

import connectDB from "../dist/db/connect.js";
import mongoose, { Types } from "mongoose";
import { PlayerModel } from "../dist/models/player.js";
import { TeamModel } from "../dist/models/team.js";
import { SeasonModel } from "../dist/models/season.js";
import { PlayerRegistrationModel } from "../dist/models/player-registration.js";
import { PlayerRegistrationHistoryModel } from "../dist/models/player-registration-history.js";
import { asyncRegistration } from "../dist/utils/async/applyHistoryRecord.js";

async function rebuildPlayerRegistrationFromHistory(filter = {}) {
  console.log("=== PlayerRegistration 再構築開始 ===");

  // まず main を空に
  const result = await PlayerRegistrationModel.deleteMany(filter);
  console.log(filter, "削除件数:", result.deletedCount);

  const typeOrder = { register: 3, change: 2, deregister: 1 };
  // 全 history を取得（player + season + team の時系列順）
  const histories = await PlayerRegistrationHistoryModel.find(filter)
    .sort({
      season: 1,
      date: 1,
      team: 1,
      player: 1,
    })
    .lean();

  // JS で registration_type の優先度で並べる
  histories.sort((a, b) => {
    // ① season
    const seasonCmp = a.season.toString().localeCompare(b.season.toString());
    if (seasonCmp !== 0) return seasonCmp;

    // ② date
    const dateCmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCmp !== 0) return dateCmp;

    // ③ registration_type（カスタム優先度）
    const typeCmp =
      (typeOrder[a.registration_type] || 99) -
      (typeOrder[b.registration_type] || 99);
    if (typeCmp !== 0) return typeCmp;

    // ④ team
    const teamCmp = a.team.toString().localeCompare(b.team.toString());
    if (teamCmp !== 0) return teamCmp;

    // ⑤ player
    return a.player.toString().localeCompare(b.player.toString());
  });

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
    // await rebuildPlayerRegistrationFromHistory({
    //   player: new Types.ObjectId("68516bd288294f93ffd0c33a"),
    //   // season: new Types.ObjectId("68b7b227b3716945451a52df"),
    // });

    // await rebuildPlayerRegistrationFromHistory({
    //   player: new Types.ObjectId("68516bd288294f93ffd0ca30"),
    // });
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log("DB 接続をクローズしました");
    process.exit(0);
  }
}

start();
