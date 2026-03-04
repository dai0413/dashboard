import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import csv from "csv-parser";
import { mongoose } from "mongoose";
import { TeamModel } from "../dist/models/team.js";
import { parseObjectId } from "../dist/csvImport/utils/parseObjectId.js";

const inputPath = "../sample_data/input/teamAddOldId.csv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI || "";

const conn = await mongoose.connect(mongoUri);
const datas = [];

fs.createReadStream(path.resolve(inputPath))
  .pipe(
    csv({
      trim: true,
      mapHeaders: ({ header }) =>
        header // もとのヘッダー
          .replace(/^\uFEFF/, "") // 先頭の BOM を除去
          .trim(), // 前後の空白を除去
    })
  )
  .on("data", (row) => {
    datas.push(row);
  })
  .on("end", async () => {
    console.log("data's number is ", datas.length);

    for (const row of datas) {
      const { id, old_id } = row;

      // id で既存ドキュメントを検索して old_id を更新
      try {
        await TeamModel.updateOne(
          { _id: parseObjectId(id) },
          { $set: { old_id } }
        );
      } catch (error) {
        console.log("ERROR", error);
      }
    }
    // ② 終了処理
    await mongoose.connection.close();
    console.log("DB コネクションをクローズしました");
  });
