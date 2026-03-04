import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

import csv from "csv-parser";
import { mongoose } from "mongoose";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import Competition from "../models/competition.js";
import Season from "../models/season.js";
import { parseObjectId } from "./utils/parseObjectId.js";
import { parseBoolean } from "./utils/parseBoolean.js";
import { parseDate } from "./utils/parseDate.js";

const INPUT_BASE_PATH = process.env.INPUT_BASE_PATH;
const OUTPUT_BASE_PATH = process.env.OUTPUT_BASE_PATH;

const inputPath = path.join(INPUT_BASE_PATH, "season.csv");
const outputPath = path.join(OUTPUT_BASE_PATH, "failed_season.csv");
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    console.log("data ' s number is ", datas.length);

    for (const row of datas) {
      if (row.competition_id) {
        row.competition = row.competition_id ? row.competition_id : null;
      } else if (row.competition) {
        const competition = await Competition.findOne({
          abbr: row.competition,
        });
        row.competition = competition ? competition._id : null;
      }
    }

    const datasToAdd = datas.map((row) => {
      return {
        __original: { ...row },
        ...row,
        competition: row.competition
          ? parseObjectId(row.competition)
          : undefined,
        name: row.name,
        start_date: parseDate(row.start_date),
        end_date: parseDate(row.end_date),
        current: parseBoolean(row.current),
        note: row.note ? row.note : undefined,
      };
    });

    const invalids = [];

    for (const d of datasToAdd) {
      const doc = new Season(d);
      const err = doc.validateSync();
      if (err) {
        invalids.push({
          original: d.__original,
          error: err.message,
        });
      }
    }

    console.log("バリデーションエラー数:", invalids.length);
    if (invalids.length > 0) {
      console.log("エラー例:", invalids.slice(0, 5));
    }
    try {
      const added = await Season.insertMany(datasToAdd, {
        ordered: false,
      });
      console.log(`✅ 挿入完了: ${added.length} 件`);
    } catch (err) {
      console.error("⚠️ 一部挿入失敗");
      const writeErrors =
        err.writeErrors || err.result?.result?.writeErrors || [];

      if (writeErrors.length) {
        writeErrors.slice(0, 5).forEach((e, i) => {
          console.error(`❌ WriteError ${i + 1}:`, e.errmsg || e.message);
          if (e.err?.op) {
            console.log("❗️失敗したデータ:", e.err.op);
          }
        });
      } else {
        console.error("❌ writeErrors が得られず、失敗行を特定できません", err);
      }

      const failedRows = err.writeErrors
        .map((e) => {
          const index = e.index;
          const original = datasToAdd[index]?.__original;
          if (!original) {
            console.warn(`⚠️ インデックス ${index} の元データが見つかりません`);
            return null;
          }
          return {
            ...original,
            err:
              e.errmsg ||
              e.message ||
              e.reason?.message ||
              JSON.stringify(e.reason) ||
              "unknown error",
          };
        })
        .filter(Boolean);

      if (failedRows.length > 0) {
        // csv-writer で出力
        const csvWriter = createCsvWriter({
          path: outputPath,
          header: Object.keys(failedRows[0]).map((k) => ({ id: k, title: k })),
        });
        await csvWriter.writeRecords(failedRows);
        console.log(`❌ ${failedRows.length} 件を書き出しました`);
      } else {
        console.log("⚠️ 失敗行は検出したが、出力対象がありませんでした");
      }
    } finally {
      // ② 終了処理
      await mongoose.connection.close();
      console.log("DB コネクションをクローズしました");
    }
  });
